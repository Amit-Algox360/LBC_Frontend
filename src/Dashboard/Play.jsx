import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Play = () => {
  const [ticket, setTicket] = useState({});
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedNumbers, setSelectedNumbers] = useState(() => {
    const storedNumbers = localStorage.getItem("selectedNumbers");
    return storedNumbers ? JSON.parse(storedNumbers) : {};
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    return storedCategory || "";
  });
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    const storedTicketId = localStorage.getItem("selectedTicketId");
    return storedTicketId || "";
  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

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
        localStorage.getItem("selectedNumbers")
      );
      if (storedSelectedNumbers) {
        setSelectedNumbers(storedSelectedNumbers);
      }

      const storedCategory = localStorage.getItem("selectedCategory");
      if (storedCategory) {
        setSelectedCategory(storedCategory);
      }

      const storedTicketId = localStorage.getItem("selectedTicketId");
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
    localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));
  }, [selectedNumbers]);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("selectedTicketId", selectedTicketId);
  }, [selectedTicketId]);

  useEffect(() => {
    localStorage.setItem("ticketAmount", ticket.amount);
  }, [ticket.amount]);

  const handleNumberClick = async (number) => {
    if (!selectedCategory) {
      toast.warning("Please select a category first.");
      return;
    }
    const selectedTicket = tickets.find((ticket) => ticket._id === selectedTicketId);

    if (!selectedTicket) {
      toast.error("Selected ticket not found.");
      return;
    }

    const categoryNumbers = selectedNumbers[selectedTicketId] || [];

    if (categoryNumbers.includes(number)) {
      // Deselect the number
      setSelectedNumbers((prevSelectedNumbers) => ({
        ...prevSelectedNumbers,
        [selectedTicketId]: categoryNumbers.filter((selectedNumber) => selectedNumber !== number),
      }));
      await deleteTicket(selectedTicket._id, number);
    } else {
      // Select the number
      setSelectedNumbers((prevSelectedNumbers) => ({
        ...prevSelectedNumbers,
        [selectedTicketId]: [...categoryNumbers, number],
      }));
      await fetchTicket(selectedTicket._id, number);
    }
  };

  const fetchTicket = async (ticketId, number) => {
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        "http://localhost:8000/api/ticketNumber/create",
        {
          ticketId,
          ticketNumber: number,
        },
        { headers }
      );

      console.log("Ticket selection response:", response.data);
      if (response.data.success) {
        const updatedAmount = response.data.response.amount;
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: updatedAmount,
        }));

        setSelectedNumbers((prevSelectedNumbers) => ({
          ...prevSelectedNumbers,
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

  const deleteTicket = async (ticketId, ticketNumber) => {
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

      const response = await axios.delete(
        "http://localhost:8000/api/ticketNumber/delete",
        {
          data: {
            ticketId,
            ticketNumber,
          },
          headers,
        }
      );

      console.log("Ticket deletion response:", response.data);

      if (response.data.success) {
        const updatedAmount = response.data.response.amount;
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: updatedAmount,
        }));

        setSelectedNumbers((prevSelectedNumbers) => ({
          ...prevSelectedNumbers,
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
    const ticketId = ticket ? ticket._id : "";

    setSelectedTicketId(ticketId);
    setSelectedCategory(category);
  };

  const numbers = Array.from({ length: 100 }, (_, index) => index + 1);
  const rows = [];
  for (let i = 0; i < numbers.length; i += 10) {
    rows.push(numbers.slice(i, i + 10));
  }

  return (
    <>
      <DashboardHeader />
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
                                onClick={() => handleNumberClick(number)}
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
                  <b>Selected Numbers</b>
                </p>
                {Object.entries(categories).map(([category, label]) => (
                  <div key={category}>
                    <div className="side-category">{label}:</div>
                    {tickets
                      .filter(
                        (ticket) => ticket.amount === parseFloat(category)
                      )
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
