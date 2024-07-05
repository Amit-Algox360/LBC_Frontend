import React from 'react';
import DashboardHeader from './DashboardHeader';
export default function Cpassword() {
  return (
    <>
                  <DashboardHeader />
            {/* Banner Section Start */}
            <div className="header-inner two" style={{ marginBottom: "20px" }}>
                <div className="inner text-center">
                    <h4 className="title text-white uppercase"> CHANGE YOUR PASSWORD, Abc</h4>
                </div>
                <div className="overlay bg-opacity-5"></div>
                <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
            </div>
            {/* Banner Section End */}

            <div className='container'>
                <div className='row'>
                    <div className="col-md-12  col-sm-12 ">


                    <div className="d-flex justify-content-center">
                        <form  className='form-update' action="" method="post">
                            <div className="row">
                                <div className="col-sm-12 mb-5">
                                    <input className="form-control input-lg" type="text" placeholder="Old Password" name="mail" style={{ textAlign: "center" }} />
                                </div>
                                <div className="col-sm-12 mb-5">
                                    <input className="form-control input-lg" type="text" placeholder="New Password" name="mail" style={{ textAlign: "center" }} />
                                </div>
                                <div className="col-sm-12 mb-4">
                                    <input className="form-control input-lg" type="text" placeholder="Confirm Password" name="mail" style={{ textAlign: "center" }} />
                                </div>
                                <div className="col-sm-12"><br />
                                    <button type="submit" name="mma" className="btn btn-success btn-block" style={{ backgroundColor: "#5cb85c" }}> CHANGE</button>
                                </div>
                            </div>
                        </form>
                        </div>



                    </div>
                </div>
            </div>
            <div style={{minHeight: "800px"}}></div>
                {/* Footer  section start */}
<div className="footer-back">
      <p>Copyright © 2024 Wallet IBC World All Right Reserved</p>
    </div>
    {/* Footer section end */}
    </>
  );
}
