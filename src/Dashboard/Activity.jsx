import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { API_LIVE_URL } from '../Api/data';
import DashboardHeader from './DashboardHeader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Activity() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [email, setEmail] = useState('');
    const [transactions, setTransactions] = useState([]);

    const formatDate = (date) => {
        return date ? date.toISOString() : '';
    };

    const handleDateSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        const apiUrl = `${API_LIVE_URL}payment/readTransaction?page=1&startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${userId}`;

        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              };
            const response = await axios.get(apiUrl,{headers});
            setTransactions(response.data.response || []); 
        } catch (error) {
            console.error('Error fetching transactions by date:', error);
        }
    };
    const [data,setData]= useState('')
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
    // const handleEmailSearch = async (e) => {
    //     e.preventDefault();
    //     const apiUrl = `http://localhost:8000/api/payment/readTransactionByEmail?email=${email}`;

    //     try {
    //         const response = await axios.get(apiUrl);
    //         setTransactions(response.data.transactions || []); // Ensure transactions is always an array
    //     } catch (error) {
    //         console.error('Error fetching transactions by email:', error);
    //     }
    // };

    return (
        <>
            <DashboardHeader />
            <div className="header-inner two" style={{ marginBottom: "20px" }}>
                <div className="inner text-center">
                    <h4 className="title text-white uppercase"> HERE IS YOUR ACTIVITY, {data.firstName} {data.lastName}</h4>
                </div>
                <div className="overlay bg-opacity-5"></div>
                <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
            </div>

            <div className='container'>
                <div className='row'>
                    <div className='col-md-4 col-sm-12'>
                        <form onSubmit={handleDateSearch}>
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <div className="input-daterange" id="datepicker">
                                        <div className="input-group">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                className="form-control input-lg"
                                                placeholderText="Start Date"
                                                dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                                            />
                                            <span className="input-group-addon">TO</span>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                className="form-control input-lg"
                                                placeholderText="End Date"
                                                dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12"><br />
                                    <button type="submit" name="d2d" className="btn btn-success btn-block" style={{ backgroundColor: "#5cb85c" }}> SEARCH</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4 col-sm-12 ms-auto pull-right">
                        <form >
                            <div className="row">
                                <div className="col-sm-12">
                                    <input 
                                        className="form-control input-lg" 
                                        type="text" 
                                        placeholder="Search By Email" 
                                        name="mail" 
                                        value={email} 
                                        style={{ textAlign: "center" }} 
                                    />
                                </div>
                                <div className="col-sm-12"><br />
                                    <button type="submit" name="mma" className="btn btn-success btn-block" style={{ backgroundColor: "#5cb85c" }}> SEARCH</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div style={{ minHeight: "40px" }}></div>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 col-sm-12'>
                        <table className="table">
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction, index) => (
                                        <tr key={index}>
                                            <th scope="row" style={{ color: "#727272", fontSize: "18px", textTransform: "uppercase", fontWeight: "300" }}>
                                                {new Date(transaction.createdAt).toISOString().split('T')[0]}
                                            </th>
                                            <td style={{ color: "#727272", fontSize: "14px", fontWeight: "300" }}>
                                             <b> {transaction.paymentType} by Razorpay</b>   
                                            </td>
                                            <td style={{ textAlign: "right", color: "#727272", fontSize: "20px" }}>
                                                <b> Rs.{transaction.amount.toFixed(2)}</b>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: "center", color: "#727272", fontSize: "14px", fontWeight: "300" }}>
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
