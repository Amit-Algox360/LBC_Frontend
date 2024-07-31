import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getMonthName = (monthNumber) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthNumber];
}

const GetResult = ({ selectedDate }) => {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem("token");
      const date = selectedDate.getDate();
      const month = getMonthName(selectedDate.getMonth());
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          `http://localhost:8000/api/user/resultFetch/?month=${month}&date=${date}`,
          { headers }
        );
        console.log("Fetched Result Data:", response.data.response);
        setResult(Array.isArray(response.data.response) ? response.data.response : []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchResult();
  }, [selectedDate]);

  return (
    <div className="result-container">
      {result.length > 0 ? (
        <div className="result-list">
          <h3 className="result-title">Result:</h3>
          <ul>
            {result.map((res, index) => (
              <li key={index} className="result-item">
                <div className="result-details">
                  {res.ticketId ? (
                    <div className="ticket-details">
                    <p>
                    <strong>Lucky Number:</strong> {res.luckyNumber || "N/A"}
                  </p>
                      <p><strong>Amount:</strong> {res.ticketId.amount || "N/A"}</p>
                      <p><strong>Slot Time:</strong> {res.slotTime || "N/A"}</p>
                    </div>
                  ) : (
                    <p className="no-ticket-id">No Ticket ID</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-results">No results available.</p>
      )}
    </div>
  );
}

export default GetResult;
