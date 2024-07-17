import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { toast } from "react-toastify";
import axios from "axios";
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
    const storedNumbers = localStorage.getItem(`selectedNumbers_${userId}`);
    return storedNumbers ? JSON.parse(storedNumbers) : {};
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const storedCategory = localStorage.getItem(`selectedCategory_${userId}`);
    return storedCategory || "";
  });
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    const storedTicketId = localStorage.getItem(`selectedTicketId_${userId}`);
    return storedTicketId || "";
  });
  const [selectedHourIndex, setSelectedHourIndex] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!userId) {
      console.log("User ID not found in localStorage.");
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const userResponse = await axios.get(
        `http://localhost:8000/api/user/read?userId=${userId}`,
        { headers }
      );
      setTicket(userResponse.data.response);

      const ticketResponse = await axios.get(
        "http://localhost:8000/api/ticket/read",
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
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem(`selectedNumbers_${userId}`, JSON.stringify(selectedNumbers));
  }, [selectedNumbers, userId]);

  useEffect(() => {
    localStorage.setItem(`selectedCategory_${userId}`, selectedCategory);
  }, [selectedCategory, userId]);

  useEffect(() => {
    localStorage.setItem(`selectedTicketId_${userId}`, selectedTicketId);
  }, [selectedTicketId, userId]);

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
        `http://localhost:8000/api/user/read?userId=${userId}`,
        { headers }
      );
      setTicket(userResponse.data.response);
    } catch (error) {
      console.error("Error updating wallet balance:", error);
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
        "http://localhost:8000/api/ticketNumber/create",
        {
          ticketId,
          ticketNumber: number,
          slotTime: `${startHour}-${endHour}`,
        },
        { headers }
      );

      console.log("Ticket selection response:", response.data);
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
        toast.error(response.data.message || "Error selecting ticket.");
      }
    } catch (error) {
      console.error("Error selecting ticket:", error);
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
        "http://localhost:8000/api/ticketNumber/delete",
        {
          data: {
            ticketId,
            ticketNumber,
            slotTime: `${startHour}-${endHour}`,
          },
          headers,
        }
      );

      console.log("Ticket deletion response:", response.data);

      if (response.data.success) {
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: response.data.response.amount,
        }));

        setSelectedNumbers((prevSelectedNumbers) => ({
          [ticketId]: prevSelectedNumbers[ticketId].filter(
            (num) => num !== ticketNumber
          ),
        }));

        toast.success("Ticket deselected and deleted successfully.");
      } else {
        toast.error(response.data.message || "Error deselecting ticket.");
      }
    } catch (error) {
      console.error("Error deselecting ticket:", error);
      toast.error("Error deselecting ticket. Please try again later.");
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const ticket = tickets.find((t) => t.amount === parseFloat(category));

    // Clear selected numbers and ticket ID for previous slot
    setSelectedCategory(category);
    setSelectedTicketId(ticket ? ticket._id : "");
    
    // Fetch stored selected numbers for the new category from local storage
    const storedSelectedNumbers = JSON.parse(localStorage.getItem(`selectedNumbers_${userId}`)) || {};
    setSelectedNumbers(storedSelectedNumbers[selectedTicketId] || {});
  };
  

  const numbers = Array.from({ length: 100 }, (_, index) => index + 1); // Define the numbers array

  const rows = [];
  for (let i = 0; i < numbers.length; i += 10) {
    rows.push(numbers.slice(i, i + 10));
  }

  return (
    <>
      <DashboardHeader />
      <div className="wallet text-center">
        <h2>Slot Times</h2>
      </div>
      {hours.map((hour, index) => (
        <div className="form-check form-check-inline" key={index}>
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id={`inlineRadio${index}`}
            defaultValue={`option${index}`}
            disabled={isDisabled(index)}
            onClick={() => setSelectedHourIndex(index)}
          />
          
          <label className="form-check-label" htmlFor={`inlineRadio${index}`}>
            {hour} - {hours[(index + 1) % 24]}
          </label>
        </div>
      ))}
      <div className="main-home1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-8">
              <div className="main-table mt-5">
                <div className="card-body">
                  <table className="table table-bordered" id="customeidbysqube">
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((number, colIndex) => {
                            const isSelected =
                              selectedNumbers[selectedTicketId]?.includes(
                                number
                              );
                            return (
                              <td
                                key={colIndex}
                                onClick={() => handleNumberClick(number, selectedHourIndex)}
                                className={isSelected ? "selected" : ""}
                              >
                                {number}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                      <span>
                        <label className="category-2" htmlFor={`cat${value}`}>
                          {label}
                        </label>
                      </span>
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
                    {tickets
                      .filter((ticket) => ticket.amount === parseFloat(category))
                      .map((ticket) =>
                        (selectedNumbers[ticket._id] || []).map((number) => (
                          <span key={number}>{number} </span>
                        ))
                      )}
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
