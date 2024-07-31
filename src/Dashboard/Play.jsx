import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { toast } from "react-toastify";
import axios from "axios";
import { API_LIVE_URL } from "../Api/data";
import { API_BASE_URL } from "../Api/data";
import "react-toastify/dist/ReactToastify.css";

const Play = () => {
  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}${period}`;
  };

  const isDisabled = (index) => {
    const now = new Date();
    const currentHour = now.getHours();
    const endHour = (index + 1) % 24;
    return currentHour >= endHour;
  };

  const hours = Array.from({ length: 24 }, (_, index) => formatHour(index));
  const userId = localStorage.getItem("userId");

  const [ticket, setTicket] = useState({});
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedNumbers, setSelectedNumbers] = useState(() => {
    try {
      const storedNumbers = localStorage.getItem(`selectedNumbers_${userId}`);
      return storedNumbers ? JSON.parse(storedNumbers) : {};
    } catch (error) {
      return {};
    }
  });
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const storedCategory = localStorage.getItem(`selectedCategory_${userId}`);
      return storedCategory || "";
    } catch (error) {
      return "";
    }
  });
  
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    try {
      const storedTicketId = localStorage.getItem(`selectedTicketId_${userId}`);
      return storedTicketId || "";
    } catch (error) {
      return "";
    }
  });
  
  

  const [selectedHourIndex, setSelectedHourIndex] = useState(() => {

    const storedHourIndex = localStorage.getItem("selectedHourIndex");

    return storedHourIndex ? parseInt(storedHourIndex) : null;

  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!userId) {
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const userResponse = await axios.get(
        `${API_LIVE_URL}user/read?userId=${userId}`,
        { headers }
      );
      setTicket(userResponse.data.response);

      const ticketResponse = await axios.get(
        `${API_LIVE_URL}ticket/read`,
        { headers }
      );
      const activeTickets = ticketResponse.data.response.filter(
        (ticket) => ticket.active !== false
      );
      setTickets(activeTickets);

      const formattedCategories = activeTickets.reduce((acc, ticket) => {
        if (!acc[ticket.amount]) {
          acc[ticket.amount] = `Rs ${ticket.amount}`;
        }
        return acc;
      }, {});
      setCategories(formattedCategories);

      const storedSelectedNumbers = JSON.parse(
        localStorage.getItem(`selectedNumbers_${userId}`)
      );
      if (storedSelectedNumbers) {
        setSelectedNumbers(storedSelectedNumbers);
      }

      const storedCategory = localStorage.getItem(`selectedCategory_${userId}`);
      if (storedCategory) {
        setSelectedCategory(storedCategory);
      }

      const storedTicketId = localStorage.getItem(`selectedTicketId_${userId}`);
      if (storedTicketId) {
        setSelectedTicketId(storedTicketId);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    localStorage.setItem(`selectedNumbers_${userId}`, JSON.stringify(selectedNumbers));
  }, [selectedNumbers, userId]);

  useEffect(() => {
    const storedNumbers = localStorage.getItem(`selectedNumbers_${userId}`);
    if (storedNumbers) {
      setSelectedNumbers(JSON.parse(storedNumbers));
    }
  }, [userId]);
  useEffect(() => {
    fetchData();
  }, []);
  

  useEffect(() => {
    localStorage.setItem(`selectedCategory_${userId}`, selectedCategory);
  }, [selectedCategory, userId]);

  useEffect(() => {
    localStorage.setItem(`selectedTicketId_${userId}`, selectedTicketId);
  }, [selectedTicketId, userId]);
  
  useEffect(() => {

    if (selectedHourIndex !== null) {

      localStorage.setItem("selectedHourIndex", selectedHourIndex);

    }

  }, [selectedHourIndex]);

  const handleNumberClick = async (number, hourIndex) => {
    if (!selectedCategory) {
      toast.warning("Please select a category first.");
      return;
    }

    const selectedTicket = tickets.find((ticket) => ticket._id === selectedTicketId);
    if (!selectedTicket) {
      toast.error("Selected ticket not found.");
      return;
    }

    if (ticket.amount < selectedTicket.amount) {
      toast.error("Insufficient balance. Please recharge your wallet.");
      const categoryNumbers = selectedNumbers[selectedTicketId] || [];
      if (categoryNumbers.includes(number)) {
        setSelectedNumbers((prevSelectedNumbers) => ({
          ...prevSelectedNumbers,
          [selectedTicketId]: categoryNumbers.filter((selectedNumber) => selectedNumber !== number),
        }));
        await deleteTicket(selectedTicket._id, number, hourIndex);
      }
      return;
    }

    const categoryNumbers = selectedNumbers[selectedTicketId] || [];

    if (categoryNumbers.includes(number)) {
      setSelectedNumbers((prevSelectedNumbers) => ({
        ...prevSelectedNumbers,
        [selectedTicketId]: categoryNumbers.filter((selectedNumber) => selectedNumber !== number),
      }));
      await deleteTicket(selectedTicket._id, number, hourIndex);
    } else {
      setSelectedNumbers((prevSelectedNumbers) => ({
        ...prevSelectedNumbers,
        [selectedTicketId]: [...categoryNumbers, number],
      }));
      await fetchTicket(selectedTicket._id, number, hourIndex);
    }

    try {
      const token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const userResponse = await axios.get(
        `${API_LIVE_URL}user/read?userId=${userId}`,
        { headers }
      );
      setTicket(userResponse.data.response);
    } catch (error) {
      toast.error("Error updating wallet balance. Please try again later.");
    }
  };

  const fetchTicket = async (ticketId, number, hourIndex) => {
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const selectedTicket = tickets.find((ticket) => ticket._id === ticketId);
      if (!selectedTicket) {
        toast.error("Selected ticket not found.");
        return;
      }

      const startHour = hours[hourIndex];
      const endHour = hours[(hourIndex + 1) % 24];

      const response = await axios.post(
        `${API_LIVE_URL}ticketNumber/create`,
        {
          ticketId,
          ticketNumber: number,
          slotTime: `${startHour}-${endHour}`,
        },
        { headers }
      );

      if (response.data.success) {
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: response.data.response.amount,
        }));
        setSelectedNumbers((prevSelectedNumbers) => ({
          [ticketId]: [...(prevSelectedNumbers[ticketId] || []), number],
        }));
        toast.success("Ticket selected successfully.");
      } else {
        toast.success(response.data.message || "Error selecting ticket.");
      }
    } catch (error) {
      toast.error("Error selecting ticket. Please try again later.");
    }
  };

  const deleteTicket = async (ticketId, ticketNumber, hourIndex) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not available. Please log in.");
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const startHour = hours[hourIndex];
      const endHour = hours[(hourIndex + 1) % 24];

      const response = await axios.delete(
        `${API_LIVE_URL}ticketNumber/delete`,
        {
          data: {
            ticketId,
            ticketNumber,
            slotTime: `${startHour}-${endHour}`,
          },
          headers,
        }
      );


      if (response.data.success) {
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: response.data.response.amount,
        }));

        setSelectedNumbers((prevSelectedNumbers) => {

          const newSelectedNumbers = { ...prevSelectedNumbers };

          const updatedNumbers = newSelectedNumbers[ticketId].filter(

            (num) => num !== ticketNumber

          );
          if (updatedNumbers.length === 0) {
            delete newSelectedNumbers[ticketId];
          } else {
            newSelectedNumbers[ticketId] = updatedNumbers;
          }
          return newSelectedNumbers;

        });
      } else {
        toast.error(response.data.message || "Error deselecting ticket.");
      }
    } catch (error) {
      toast.error("Error deselecting ticket. Please try again later.");
    }
  };
  const handleSlotTimeClick = (index) => {
    if (isDisabled(index)) {
      return;
    }
    localStorage.setItem(`selectedNumbers_${selectedHourIndex}`, JSON.stringify(selectedNumbers));
    setSelectedHourIndex(index);
    const storedNumbers = localStorage.getItem(`selectedNumbers_${index}`);
    setSelectedNumbers(storedNumbers ? JSON.parse(storedNumbers) : {});
  }
  
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const selectedTicket = tickets.find((t) => t.amount === parseFloat(category));
    localStorage.setItem(`selectedNumbers_${userId}_${selectedCategory}`, JSON.stringify(selectedNumbers));
    setSelectedCategory(category);
    setSelectedTicketId(selectedTicket ? selectedTicket._id : "");
    const storedSelectedNumbers = JSON.parse(localStorage.getItem(`selectedNumbers_${userId}_${category}`)) || [];
    setSelectedNumbers(storedSelectedNumbers);
  };
  
  

  const numbers = Array.from({ length: 100 }, (_, index) => index + 1);

  const rows = [];
  for (let i = 0; i < numbers.length; i += 10) {
    rows.push(numbers.slice(i, i + 10));
  }

 const filteredNumbers = selectedNumbers[selectedTicketId] || [];

return (
  <>
    <DashboardHeader />
    <div className="wallet text-center">
      <h2>Slot Times</h2>
    </div>
    <div className="slot-time-container">
      {hours.map((hour, index) => (
        <button
          key={index}
          className={`slot-time-button ${isDisabled(index) ? "disabled" : ""}${selectedHourIndex === index ? "selected" : ""}`}
          onClick={() => handleSlotTimeClick(index)}
          disabled={isDisabled(index)}
        >
          {hour} - {hours[(index + 1) % 24]}
        </button>
      ))}
    </div>
    <div className="main-home1">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-8">
            <div className="main-table mt-5">
              <div className="card-body">
                {selectedHourIndex !== null && (
                  <table className="table table-bordered" id="customeidbysqube">
                    <tbody>
                      {Array.from({ length: 10 }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array.from({ length: 10 }, (_, colIndex) => {
                            const number = rowIndex * 10 + colIndex + 1;
                            return (
                              <td
                                key={number}
                                className={`number-button ${
                                  filteredNumbers.includes(number) ? "selected" : ""
                                }`}
                                onClick={() => handleNumberClick(number, selectedHourIndex)}
                              >
                                {number}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="wallet text-center">
              <h2>Wallet Balance: {ticket.amount}</h2>
            </div>
            <div className="category">
              <p>Categories</p>
              <div className="category-1">
                {Object.entries(categories).map(([value, label]) => (
                  <div key={value}>
                    <input
                      type="radio"
                      id={`cat${value}`}
                      name="category"
                      value={value}
                      onChange={handleCategoryChange}
                      checked={selectedCategory === value}
                    />
                    <label className="category-2" htmlFor={`cat${value}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="side-panel">
              <p>
                <b>MY GAME </b>
              </p>
              {Object.entries(categories).map(([category, label]) => (
                <div key={category}>
                  <div className="side-category">{label}:</div>
                  {(selectedNumbers[tickets.find((ticket) => ticket.amount === parseFloat(category))?._id] || []).map((number) => (
                    <span key={number}>{number} </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

};

export default Play;