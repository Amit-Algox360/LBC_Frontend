import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../DashboardHeader";
import axios from "axios";
import { API_LIVE_URL } from "../../Api/data";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

const Result = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [ticket, setTicket] = useState([]);
  const [result, setResult] = useState([]);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}${period}`;
  };

  const hours = Array.from({ length: 24 }, (_, index) => formatHour(index));

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("token");

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_LIVE_URL}ticket/read`, { headers });
        console.log("Fetched Ticket Data:", response.data.response);
        setTicket(Array.isArray(response.data.response) ? response.data.response : []);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchResult = async () => {
      const token = localStorage.getItem("token");
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_LIVE_URL}user/resultFetch/`, { headers });
        console.log("Fetched Result Data:", response.data.response);
        setResult(Array.isArray(response.data.response) ? response.data.response : []);
      } catch (e) {
        console.log(e);
      }
    };

    fetchTicket();
    fetchResult();

    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      if (minutes === 0 && seconds === 0) {
        handleDeclare();
      }

      if (hours === 0 && minutes === 0 && seconds === 0) {
        setCurrentDate(getDate());
        window.location.reload();
      }

      setCurrentHour(now.getHours());
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, []);

  const handleDeclare = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (ticket.length > 0) {
        const currentHourIndex = currentHour % 24;
        const startHour = hours[currentHourIndex];
        const endHour = hours[(currentHourIndex + 1) % 24];

        const response = await axios.post(
          `${API_LIVE_URL}user/result`,
          { ticketCategoryId: ticket[0]._id, slotTime: `${startHour}-${endHour}` },
          { headers }
        );

        if (response.data.status === 401) {
          console.log(response.data.message);
        } else if (response.data.status === 201) {
          setSelectedSlot({
            slotTime: `${startHour}-${endHour}`,
            luckyNumber: response.data.response.luckyNumber
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="container2">
        <div className="row">
          <h1 className="text-center text-uppercase fw-bold p-3">
            IBC-Wallet day result {currentDate}
          </h1>
        </div>
      </div>
      <div className="container1">
        <div className="row">
          {ticket.length > 0 && (
            <div className="ticket-container">
              {ticket.map((item, index) => (
                <div key={index} className="ticket-item">
                  <h2 className="fw-bold result">{item.amount}</h2>
                  <div className="result-details">
                    {result
                      .filter((res) => res.ticketId && res.ticketId._id === item._id)
                      .map((res, resIndex) => (
                        <div key={resIndex}>
                          <p className="result-lucky-number">
                            <strong>Lucky Number:</strong> {res.luckyNumber || "N/A"}
                          </p>
                          <p><strong>Slot Time:</strong> {res.slotTime || "N/A"}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedSlot && (
        <div className="container mt-3">
          <h3>Selected Slot:</h3>
          <p>Slot Time: {selectedSlot.slotTime}</p>
          <p>Lucky Number: {selectedSlot.luckyNumber}</p>
        </div>
      )}
    </>
  );
};

export default Result;
