import axios from 'axios';
import React, { useState } from 'react';
import { API_BASE_URL } from '../Api/data';
import { API_LIVE_URL } from '../Api/data';
import { Link, useNavigate } from 'react-router-dom';

const Createticket = () => {
        const navigate = useNavigate()
    const [amount,setAmount]=useState([])


    // Create Ticket Api
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_LIVE_URL}ticket/create`, {
                amount: amount
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `bearer ${token}`
                }
            });

            if (response.data.status === 401) {
                console.log(response.data.message);
            } else if (response.data.status === 201) {
                console.log("add a amount");
                navigate('/data');
            }
        } catch (e) {
            console.log(e);
        }
    };
  return (
    <>
<div className='d-flex w-100 vh=100 justify-content-center algin-item-center '>
 <div className='w-50 border bg-white shadow px-5 pt-5 pd-5 rounded'>
  <h1>Add a Amount</h1>
  <form onSubmit={handleSubmit}>
    <div className='mb-5'>
        <label htmlFor='number'>Amount</label>
        <input type='text' name='number' className='form-control' placeholder='Enter Amount' value={amount} onChange={(e)=>setAmount(e.target.value)} />
    </div>
    <button className='btn btn-success'>Submit</button>
    <Link to='/data' className='btn btn-primary ms-3'>Back</Link>
  </form>
 </div>
</div>

    </>
  );
}

export default Createticket;
