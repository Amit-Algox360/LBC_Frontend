import React, { useState, useCallback } from 'react';
import DashboardHeader from './DashboardHeader';
import useRazorpay from "react-razorpay";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../Api/data';
import { PAYMENT_GATEWAY_LOGO } from '../Api/data';
import { PAYMENT_GATEWAY_DESCRIPTION } from '../Api/data';
import { REACT_APP_RAZOR_PAY_API_KEY_TEST } from '../Api/data';

function AddMoney() {
  const [amount, setAmount] = useState(0);
  const Razorpay = useRazorpay();

  const handleAmountChange = (e) => {
    setAmount(parseFloat(e.target.value));
  };

  const handlePayment = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Token not available. Please log in again.');
      return;
    }

    try {
      const requestData = { amount: amount  };
      const response = await fetch(`${API_BASE_URL}/payment/create/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await response.json();
      const orderId = orderData.response?.id;
      if (!orderId) {
        throw new Error("Order ID not received from server");
      }
   

      const options = {
        key: REACT_APP_RAZOR_PAY_API_KEY_TEST,
        amount: amount,
        currency: "INR",
        name: "I B C",
        description: PAYMENT_GATEWAY_DESCRIPTION,
        image: PAYMENT_GATEWAY_LOGO,
        order_id: orderId,
        handler: async function (response) {

          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }),
            });
            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.message || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            toast.success("Payment Added Your Account!");
          } catch (error) {
            toast.error('Error verifying payment: ' + error.message);
          }
        },
        prefill: {
          name: "john",
          email: "abcl@gmail.com",
          contact: "9191919191"
        },
        theme: {
          color: "#0000FF"
        }
      };

      const rzpay = new window.Razorpay(options);
      rzpay.open();
    } catch (error) {
      toast.error('Error handling payment: ' + error.message);
    }
  }, [amount]);

  return (
    <>
      <DashboardHeader />
      <div className="header-inner two" style={{ marginBottom: "20px" }}>
        <div className="inner text-center">
          <h4 className="title text-white uppercase">ADD MONEY TO ACCOUNT BY RAZORPAY</h4>
        </div>
        <div className="overlay bg-opacity-5"></div>
        <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
      </div>

      {/* Form section */}
      <section className='sec-padding'>
        <div className='container'>
          <div className='row'>
            <div className="col-md-12 col-sm-12">
              <div className="d-flex justify-content-center">
                <form className='form-update' action="" method="post">
                  <div className="row">
                    <div className="input-group d-flex justify-content-center">
                      <span className="input-group-addon">$</span>
                      <input
                        className="form-control input-lg"
                        type="text"
                        placeholder="AMOUNT..."
                        name="amount"
                        id="amount"
                        onChange={handleAmountChange}
                      />
                      <span className="input-group-addon">INR</span>
                    </div>
                    <p style={{ color: "red" }}>* RazorPay Charges May Apply</p>
                    {/* Button to trigger payment */}
                    <div className="col-sm-12"><br />
                      <button
                        type="button"
                        name="mma"
                        className="btn btn-success btn-block"
                        style={{ backgroundColor: "#5cb85c" }}
                        onClick={handlePayment}
                      >
                        ADD NOW
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddMoney;
