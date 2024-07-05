import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Play = () => {
  const [ticket, setTicket] = useState({});
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedNumbers, setSelectedNumbers] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");

  // Function to fetch data on login
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

      // Fetch user data
      const userResponse = await axios.get(
        `http://localhost:8000/api/user/read?userId=${userId}`,
        { headers }
      );
      setTicket(userResponse.data.response);

      // Fetch active tickets
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
      const storedSelectedNumbers = JSON.parse(localStorage.getItem("selectedNumbers"));
      if (storedSelectedNumbers) {
        setSelectedNumbers(storedSelectedNumbers);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleNumberClick = async (number) => {
    if (!selectedCategory) {
      toast.warning("Please select a category first.");
      return;
    }
    const selectedTicket = tickets.find(
      (ticket) => ticket._id === selectedTicketId
    );

    if (!selectedTicket) {
      toast.error("Selected ticket not found.");
      return;
    }

    const categoryNumbers = selectedNumbers[selectedTicketId] || [];

    if (categoryNumbers.includes(number)) {
      setSelectedNumbers((prevSelectedNumbers) => ({
        ...prevSelectedNumbers,
        [selectedTicketId]: categoryNumbers.filter(
          (selectedNumber) => selectedNumber !== number
        ),
      }));
      await deleteTicket(selectedTicket._id, number);
    } else {
      setSelectedNumbers((prevSelectedNumbers) => ({
        ...prevSelectedNumbers,
        [selectedTicketId]: [...categoryNumbers, number],
      }));
      await fetchTicket(selectedTicket._id, number);
    }
  };

  // Function to fetch ticket details
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
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: response.data.response.amount,
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

  // Function to delete ticket
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
        setTicket((prevTicket) => ({
          ...prevTicket,
          amount: response.data.response.amount,
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

  // Function to handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const ticket = tickets.find((t) => t.amount === parseFloat(category));
    const ticketId = ticket ? ticket._id : "";

    setSelectedTicketId(ticketId);
    setSelectedCategory(category);
  };

  // Generate number rows
  const numbers = [1	,2	,3,	4	,5,	6,	7,	8,	9,	10,
11	,12,	13,	14	,15	,16	,17,	18	,19	,20,
21,	22,	23,	24,	25,	26	,27	,28,	29,	30,
31,	32,	33,	34	,35,	36,	37,	38,	39,	40,
41,	42,	43,	44,	45,	46,	47,	48,	49,	50,
51,	52,	53,	54,	55,	56,	57,	58,	59	,60,
61,	62,	63,	64,	65,	66	,67,	68,	69,	70,
71,	72,	73,	74,	75,	76	,77,	78,	79,	80,
81,	82,	83,	84,	85,	86,	87	,88	,89,	90,
91,	92,	93,	94,	95,	96,	97,	98,	99,	100,];
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
                {selectedNumbers[selectedTicketId] && (
                  <div>
                    <div className="side-category">
                      {categories[selectedTicketId]}
                    </div>
                    {selectedNumbers[selectedTicketId].map((number) => (
                      <span key={number}>{number} </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Play;
