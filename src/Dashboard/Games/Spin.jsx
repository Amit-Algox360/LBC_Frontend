import React, { useEffect, useState } from 'react';
import DashboardHeader from '../DashboardHeader';
import { API_LIVE_URL } from '../../Api/data';
import axios from 'axios';

const CustomSpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_LIVE_URL}user/read?userId=${userId}`, { headers });
        setData(response.data.response);
        console.log('User Data:', response.data.response);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const segments = [
    'Rs.20',
    'Better Luck Next Time',
    'Rs.150',
    'Better Luck Next Time',
    'Rs.30',
    'Rs.200',
    'Better Luck Next Time',
    'Rs.50',
    'Better Luck Next Time',
    'Rs.100',
    'Better Luck Next Time',
    'Better Luck Next Time',
  ];

  const spinWheel = async () => {
    if (spinning) return;

    const amountToDeduct = 100; 

    if (data.amount < amountToDeduct) {
      alert('Insufficient balance');
      return;
    }

    setSpinning(true);
    setResult(null);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await axios.get(
        `${API_LIVE_URL}spinner/spin?amount=${amountToDeduct}`,
        { headers }
      );

      setData((prevData) => ({ ...prevData, amount: prevData.amount - amountToDeduct }));

      const wheel = document.getElementById('wheel');
      const randomDeg = Math.floor(Math.random() * 360);
      const totalDegrees = 360 * 5 + randomDeg;

      wheel.style.transition = 'transform 3s ease-out';
      wheel.style.transform = `rotate(${totalDegrees}deg)`;

      setTimeout(async () => {
        const index = Math.floor((360 - (randomDeg % 360)) / (360 / segments.length));
        const segmentResult = segments[index];
        setResult(segmentResult);
        setSpinning(false);
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${totalDegrees % 360}deg)`;

        if (segmentResult.startsWith('Rs.')) {
          const winAmount = parseInt(segmentResult.replace('Rs.', ''));
          try {
            await axios.get(
              `${API_LIVE_URL}spinner/win?winamount=${winAmount}`,
              { headers }
            );
            setData((prevData) => ({ ...prevData, amount: prevData.amount + winAmount }));
          } catch (e) {
            console.log(e);
          }
        }
      }, 3000);
    } catch (e) {
      console.log(e);
      setSpinning(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="wallet text-center">
        <h2>Wallet Balance: {data.amount}</h2>
      </div>
      <div className="spin-wheel-container">
        <div className="wheel-wrapper">
          <div id="wheel" className="wheel">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="segment"
                style={{ transform: `rotate(${index * (360 / segments.length)}deg)` }}
              >
                <div className="segment-content">
                  <div className='number change'>
                    {segment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={spinWheel} disabled={spinning}>
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
        {result && (
          <div className="result">
            {result === 'Better Luck Next Time' ? (
              <span>Better Luck Next Time!</span>
            ) : (
              <span>Congratulations! You won: <b>{result}</b>!</span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CustomSpinWheel;
