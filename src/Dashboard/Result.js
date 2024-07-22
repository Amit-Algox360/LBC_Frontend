import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "./DashboardHeader";
import axios from "axios";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}


const Result = () => {
  const [ticket, setTicket] = useState([]);
  const [currentDate] = useState(getDate());
  const [timer, setTimer] = useState("00:00:10");
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const Ref = useRef(null);
  const [result, setResult] = useState(null);

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}${period}`;
  };
  

  const hours = Array.from({ length: 24 }, (_, index) => formatHour(index));

  useEffect(() => {
    function getTimeRemaining(e) {
      const total = Date.parse(e) - Date.parse(new Date());
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const seconds = Math.floor((total / 1000) % 60);

      return { total, hours, minutes, seconds };
    }

    function startTimer(e) {
      let { total, hours, minutes, seconds } = getTimeRemaining(e);
      if (total >= 0) {
        setTimer(
          (hours > 9 ? hours : "0" + hours) +
            ":" +
            (minutes > 9 ? minutes : "0" + minutes) +
            ":" +
            (seconds > 9 ? seconds : "0" + seconds)
        );
      } else {
        setIsTimerComplete(true);
        clearInterval(Ref.current);
      }
    }

    function clearTimer(e) {
      if (Ref.current) clearInterval(Ref.current);
      const id = setInterval(() => {
        startTimer(e);
      }, 1000);
      Ref.current = id;
    }

    function getDeadTime() {
      let deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 10);
      return deadline;
    }

    let deadline;
    const savedDeadline = localStorage.getItem("deadline");

    if (savedDeadline) {
      deadline = new Date(savedDeadline);
    } else {
      deadline = getDeadTime();
      localStorage.setItem("deadline", deadline);
    }

    clearTimer(deadline);

    return () => {
      if (Ref.current) clearInterval(Ref.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerComplete) {
      localStorage.removeItem("deadline");
    }
  }, [isTimerComplete]);

  const fetchResult = async (ticketId, hourIndex) => {
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const startHour = hours[hourIndex];
      const endHour = hours[(hourIndex + 1) % 24];
      const response = await axios.get(
        "http://localhost:8000/api/user/result",
        {
          ticketId,
          slotTime: `${startHour}-${endHour}`,
        },
        {
          headers,
        }
      );
      setResult(response.data.response);
    } catch (e) {
      console.log(e);
    }
  };


  const handledeclare = async (ticketId, hourIndex) => {
    try {
        const token = localStorage.getItem('token');
        const startHour = hours[hourIndex];
        const endHour = hours[(hourIndex + 1) % 24];
        const response = await axios.post('http://localhost:8000/api/user/result', {
          ticketId,
          slotTime: `${startHour}-${endHour}`,
        }, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `bearer ${token}`
            }
        });

        if (response.data.status === 401) {
            console.log(response.data.message);
        } else if (response.data.status === 201) {
            console.log("===...",response.data.response);
        }
    } catch (e) {
        console.log(e);
    }
};

  useEffect(() => {
    const fetchticket = async () => {
      const token = localStorage.getItem("token");

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          "http://localhost:8000/api/ticket/read",
          { headers }
        );
        setTicket(response.data.response);
        console.log("==>", response.data.response);
      } catch (e) {
        console.log(e);
      }
    };
    fetchticket();
  }, []);

  return (
    <>
      <DashboardHeader />
      <div className="container">
        <div className="row">
          <h1 className="text-center text-uppercase fw-bold p-3">
            IBC-Wallet day result {currentDate}
          </h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {ticket.map((item, index) => (
            <div key={index}>
              <h2 className="fw-bold d-inline">{item.amount}</h2>
            </div>
          ))}
        </div>
      </div> 
       {hours.map((hour, index) => (
        <button
          key={index}
          onClick={() => handledeclare(index)}
        >
          {hour} - {hours[(index + 1) % 24]}
        </button>
      ))}

      {/* <div className='d-grid gap-2 col-1 mx-auto'>
            <h1>{timer}</h1>
          </div>
          <div>
            {categories.map(category => (
              <div key={category.id}>
                <h2 className='fw-bold d-inline'>Category {category.name}</h2>
                <span>
                  <button
                    onClick={() => fetchResult(category.id, new Date().getHours())}
                    disabled={!isTimerComplete}
                    style={{
                      backgroundColor: isTimerComplete ? 'green' : 'gray',
                      cursor: isTimerComplete ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <b>Result</b>
                  </button>
                </span>
              </div>
            ))}
            {result && (
              <div>
                <h3>Result:</h3>
                <p>{result}</p>
              </div>
            )}
          </div> */}
    </>
  );
};

export default Result;
