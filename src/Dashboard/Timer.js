import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Timer = () => {
    const [timer, setTimer] = useState("01:00:00");
    const [isTimerComplete, setIsTimerComplete] = useState(false);
    const Ref = useRef(null);
    const navigate = useNavigate();

    // const formatHour = (hour) => {
    //     const period = hour >= 12 ? 'PM' : 'AM';
    //     const formattedHour = hour % 12 || 12; 
    //     return `${formattedHour}${period}`;
    // };

    // const hours = Array.from({ length: 24 }, (_, index) => formatHour(index));

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const seconds = Math.floor((total / 1000) % 60);

        return { total, hours, minutes, seconds };
    };

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (hours > 9 ? hours : "0" + hours) + ':' +
                (minutes > 9 ? minutes : "0" + minutes) + ':' +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        } else {
            setIsTimerComplete(true);
            clearInterval(Ref.current);
        }
    };

    const clearTimer = (e) => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setHours(deadline.getHours() + 1);
        return deadline;
    };

    useEffect(() => {
        let deadline;
        const savedDeadline = localStorage.getItem('deadline');

        if (savedDeadline) {
            deadline = new Date(savedDeadline);
        } else {
            deadline = getDeadTime();
            localStorage.setItem('deadline', deadline);
        }

        clearTimer(deadline);

        return () => {
            if (Ref.current) clearInterval(Ref.current);
        };
    }, []);

    useEffect(() => {
        if (isTimerComplete) {
            localStorage.removeItem('deadline');
        }
    }, [isTimerComplete]);

    // const isDisabled = (index) => {
    //     const now = new Date();
    //     const startHour = index;
    //     const endHour = (index + 1) % 24;
    //     const currentHour = now.getHours();

    //     return (currentHour >= endHour);
    // };

    return (
        <>
            <div className='d-grid gap-2 col-1 mx-auto'>
                <h1>{timer}</h1>
            </div>
            {/* <div className='d-grid gap-2 col-2 mx-auto'>
                <button 
                    onClick={() => navigate('/result')} 
                    disabled={!isTimerComplete}
                    style={{ 
                        backgroundColor: isTimerComplete ? 'green' : 'gray', 
                        cursor: isTimerComplete ? 'pointer' : 'not-allowed' 
                    }}
                >
                    <b>Result</b>
                </button>
            </div> */}
            {/* {hours.map((hour, index) => (
                <div className="form-check form-check-inline" key={index}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id={`inlineRadio${index}`}
                        defaultValue={`option${index}`}
                        disabled={isDisabled(index)}
                    />
                    <label className="form-check-label" htmlFor={`inlineRadio${index}`}>
                        {hour} to {hours[(index + 1) % 24]}
                    </label>
                </div>
            ))} */}
        </>
    );
}

export default Timer;
