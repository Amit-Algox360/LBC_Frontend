import React, { useState, useEffect } from "react";
import DashboardHeader from "../DashboardHeader";
import axios from "axios";
import GetResult from "./GetResult";
import DatePicker from "react-datepicker";
import { API_BASE_URL } from "../../Api/data";
import { API_LIVE_URL } from "../../Api/data";
import "react-datepicker/dist/react-datepicker.css";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

const getMonthName = (monthNumber) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthNumber];
}

const Result = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [ticket, setTicket] = useState([]);
  const [currentDate] = useState(getDate());
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}${period}`;
  };

  const hours = Array.from({ length: 24 }, (_, index) => formatHour(index));

  useEffect(() => {
    const fetchticket = async () => {
      const token = localStorage.getItem("token");

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          `${API_LIVE_URL}ticket/read`,
          { headers }
        );
        console.log("Fetched Ticket Data:", response.data.response);
        setTicket(Array.isArray(response.data.response) ? response.data.response : []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchticket();
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeclare = async (ticketCategoryId, hourIndex) => {
    try {
      const token = localStorage.getItem('token');
      const date = selectedDate.getDate();
      const month = getMonthName(selectedDate.getMonth());
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const startHour = hours[hourIndex];
      const endHour = hours[(hourIndex + 1) % 24];
      const response = await axios.post(
        `${API_LIVE_URL}user/result`,
        { ticketCategoryId, slotTime: `${startHour}-${endHour}`, month, date },
        { headers }
      );

      if (response.data.status === 401) {
        console.log(response.data.message);
      } else if (response.data.status === 201) {
        setSelectedSlot({
          slotTime: `${startHour}-${endHour}`,
          luckyNumber: response.data.response.luckyNumber
        });

        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isSlotEnabled = (hourIndex) => {
    const now = new Date();
    const slotStartHour = hours[hourIndex];
    const slotEndHour = hours[(hourIndex + 1) % 24];
  
    const parseTime = (timeStr) => {
      const [hour, period] = timeStr.match(/(\d+)(AM|PM)/).slice(1);
      const date = new Date();
      let hour24 = parseInt(hour, 10);
      if (period === "PM" && hour !== "12") hour24 += 12;
      if (period === "AM" && hour === "12") hour24 = 0;
      return new Date(date.setHours(hour24, 0, 0, 0));
    };
  
    const slotStartTime = parseTime(slotStartHour);
    const slotEndTime = parseTime(slotEndHour);

    if (hourIndex === currentHour) {
      return false;
    }
  
    if (slotStartTime > slotEndTime) {
      return now >= slotStartTime || now < slotEndTime;
    }
  
    return now >= slotStartTime &&  slotEndTime;
  };
  

  return (
    <>
      <DashboardHeader />
      <div className="container3">
        <div className="row">
          <h1 className="text-center text-uppercase fw-bold p-3">
            IBC-Wallet Day Result {currentDate}
          </h1>
          <div className="col-12 d-flex justify-content-center">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()} 
            />
          </div>
        </div>
      </div>
      <div className="container3">
        <div className="row">
          {ticket.length > 0 && ticket.map((item, index) => (
            <div key={index} className="ticket-card">
              <div className="ticket-info">
                <h2 className="fw-bold amount">{item.amount}</h2>
                <div className="slot-buttons">
                  {hours.map((hour, hourIndex) => (
                    <button
                      key={hourIndex}
                      onClick={() => handleDeclare(item._id, hourIndex)}
                      disabled={!isSlotEnabled(hourIndex)}
                      className={`slot-button ${isSlotEnabled(hourIndex) ? 'enabled' : 'disabled'}`}
                    >
                      {hour} - {hours[(hourIndex + 1) % 24]}
                    </button>
                  ))}
                </div>
              </div>
              {selectedSlot && selectedSlot.slotTime.includes(hours[currentHour]) && (
                <div className="result-info">
                  <p><strong>Slot Time:</strong> {selectedSlot.slotTime}</p>
                  <p><strong>Lucky Number:</strong> {selectedSlot.luckyNumber}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <GetResult selectedDate={selectedDate} />
    </>
  );
};

export default Result;
