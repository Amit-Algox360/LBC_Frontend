import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Link } from 'react-router-dom';
export default function Main() {
    return (
        <>
  <DashboardHeader/>
     {/* Banner Section Start */}
     <div className="header-inner two" style={{ marginBottom: "20px" }}>
                <div className="inner text-center">
                    <h4 className="title text-white uppercase"> Welcome Back Abc</h4>
                </div>
                <div className="overlay bg-opacity-5"></div>
                <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
            </div>
            {/* Banner Section End */} 

            {/* Dashboard Section start */}
            <section className='balance-section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-4 col-sm-12'>
                            <div className='balance'>
                                <h5>Your Current Balance</h5>
                                <div className=" sh-divider-line solid light margin"></div>
                                <br />
                                <h3> 80 USD</h3>
                            </div>


                            <div className='balance'>
                                <ul className='category-links'>
                                    <li>
                                        <Link to='activity'> Activity</Link>
                                    </li>
                                    <li>
                                        <Link to='#'> Send Money</Link>
                                    </li>
                                    <li>
                                        <Link to='#'> Request Money</Link>
                                    </li>
                                    <li>
                                        <Link to='addMoney'> Add Money</Link>
                                    </li>
                                    <li>
                                        <Link to='withdrawl'> Withdraw Money</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-8 col-sm-12'>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th scope="row" style={{ color: "#727272" ,fontSize: "18px" ,textTransform: "uppercase", fontWeight:"300"}}>13
                                        <br/>Sep</th>
                                        <td style={{ color: "#727272" ,fontSize: "14px" , fontWeight:"300"}}>	Withdraw By PayPal</td>
                                        <td style={{textAlign:"right", color: "#727272" ,fontSize: "20px"}}><b> $ 200.00</b> </td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                    <th scope="row" style={{ color: "#727272" ,fontSize: "18px" ,textTransform: "uppercase", fontWeight:"300"}}>13
                                        <br/>Sep</th>
                                        <td style={{ color: "#727272" ,fontSize: "14px" , fontWeight:"300"}}>	Withdraw By PayPal</td>
                                        <td style={{textAlign:"right", color: "#727272" ,fontSize: "20px"}}><b> $ 200.00</b> </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
            {/* Dashboard Section End */}

{/* Footer  section start */}
<div className="footer-back">
      <p>Copyright © 2024 Wallet IBC World All Right Reserved</p>
    </div>
    {/* Footer section end */}
        </>
    );
}
