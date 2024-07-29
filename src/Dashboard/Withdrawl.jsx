import React, { useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import DashboardHeader from './DashboardHeader';

const REACT_APP_RAZOR_PAY_API_KEY_TEST = process.env.REACT_APP_RAZOR_PAY_API_KEY_TEST;
const REACT_APP_RAZOR_PAY_API_KEY_SECRET = process.env.REACT_APP_RAZOR_PAY_API_KEY_SECRET;

function Withdrawl() {
    const [amount, setAmount] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const auth = Buffer.from(`${REACT_APP_RAZOR_PAY_API_KEY_TEST}:${REACT_APP_RAZOR_PAY_API_KEY_SECRET}`).toString('base64');

        const createContact = async () => {
            let customerId = localStorage.getItem('customerId');
            const response = await axios.post('https://api.razorpay.com/v1/contacts', {
                name: 'Amit',
                email: email,
                contact: '8794561236',
                type: 'customer',
                reference_id: customerId
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`
                }
            });
            return response.data.id;
        };

        const createFundAccount = async (contactId) => {
            const response = await axios.post('https://api.razorpay.com/v1/fund_accounts', {
                contact_id: contactId,
                account_type: 'bank_account',
                bank_account: {
                    name: 'Gaurav Kumar',
                    ifsc: 'HDFC0009107',
                    account_number: '50100102283912'
                }
            }, {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            });
            return response.data.id;
        };

        const createPayout = async (fundAccountId) => {
            let customerId = localStorage.getItem('customerId');
            const response = await axios.post('https://api.razorpay.com/v1/payouts', {
                account_number: '2323230032510196',
                fund_account_id: fundAccountId,
                amount: amount * 100,
                currency: 'INR',
                mode: 'IMPS',
                purpose: 'payout',
                queue_if_low_balance: true,
                reference_id: customerId,
                narration: 'LBC',
                notes: { message }
            }, {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            });
            return response.data;
        };

        try {
            const contactId = await createContact(auth);
            const fundAccountId = await createFundAccount(contactId,auth);
            const payout = await createPayout(fundAccountId,auth);
            alert('Payout successful!');
            console.log(payout);
        } catch (error) {
            console.error(error);
            alert('Payout failed. Please try again.');
        }
    };

    return (
        <>
            <DashboardHeader />
            <div className="header-inner two" style={{ marginBottom: "20px" }}>
                <div className="inner text-center">
                    <h4 className="title text-white uppercase">WITHDRAW MONEY - RAZORPAY</h4>
                </div>
                <div className="overlay bg-opacity-5"></div>
                <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
            </div>

            <section className="sec-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3 col-sm-12">
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb15">
                                    <input
                                        className="form-control input-lg"
                                        type="text"
                                        name="amount"
                                        id="am"
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <span className="input-group-addon">USD</span>
                                </div>
                                <br />
                                <br />
                                <input
                                    type="text"
                                    className="form-control input-lg"
                                    name="goesto"
                                    placeholder="PayPal Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <br />
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    name="message"
                                    placeholder="Your Message (Optional)"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    style={{ width: "635px", height: "126px" }}
                                />
                                <br />
                                <button type="submit" name="mma" className="btn btn-success btn-block" style={{ backgroundColor: "#5cb85c" }}>
                                    SEND
                                </button>
                            </form>
                        </div>
                        <div style={{ minHeight: "800px" }}></div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Withdrawl;
