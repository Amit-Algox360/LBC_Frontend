import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Timer = () => {
    const [timer, setTimer] = useState("00:00:10");
    const [isTimerComplete, setIsTimerComplete] = useState(false);
    const Ref = useRef(null);
    const navigate = useNavigate();

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
                (hours > 9 ? hours : "0" + hours) + ':' +
                (minutes > 9 ? minutes : "0" + minutes) + ':' +
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

    return (
        <>
            <div className='d-grid gap-2 col-1 mx-auto'>
                <h1>{timer}</h1>
            </div>
            <div className='d-grid gap-2 col-2 mx-auto'>
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
            </div>
        </>
    );
}

export default Timer;
