import React from 'react';
import DashboardHeader from './DashboardHeader';
function Withdrawl() {
    return (
    <>
            <DashboardHeader />
            {/* Banner Section Start */}
            <div className="header-inner two" style={{ marginBottom: "20px" }}>
                <div className="inner text-center">
                    <h4 className="title text-white uppercase">WITHDRAW MONEY - RAZORPAY</h4>
                </div>
                <div className="overlay bg-opacity-5"></div>
                <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
            </div>
            {/* Banner Section End */}

            <section className="sec-padding">
                <div className="container">
                    <div className="row">


                        <div className="col-md-6 col-md-offset-3 col-sm-12">
                            <form action="" method="post">
                                <div className="input-group mb15">
                                    <input className="form-control input-lg" type="text" name="amount" id="am" placeholder="Amount"/>
                                        <span className="input-group-addon">USD</span>
                                </div>
                                <br/>
                                    <br/><input type="text" className="form-control input-lg" name="goesto" placeholder="PayPal Email" required=""/>
                                        <br/>
                                            <textarea className="form-control" rows="5" name="message" placeholder="Your Message (Optional)" style={{width: "635px", height: "126px"}}></textarea>
                                            <br/>
                                            <button type="submit" name="mma" className="btn btn-success btn-block" style={{ backgroundColor: "#5cb85c" }}> SEND</button>
                                            </form>
                                        </div>
                                        <div style={{minHeight: "800px"}}></div>
                                    </div>
                                    </div>
                                </section>
                            </>
                            );
}

                            export default Withdrawl;
