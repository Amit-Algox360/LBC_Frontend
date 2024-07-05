import React from 'react';
import DashboardHeader from './DashboardHeader';

export default function Activity() {
    return (
        <>
            <DashboardHeader />
            {/* Banner Section Start */}
            <div className="header-inner two" style={{ marginBottom: "20px" }}>
                <div className="inner text-center">
                    <h4 className="title text-white uppercase"> HERE IS YOUR ACTIVITY, Abc</h4>
                </div>
                <div className="overlay bg-opacity-5"></div>
                <img src="https://img.hotimg.com/bannerf16f185409960eb1.jpeg" alt="" className="img-responsive" />
            </div>
            {/* Banner Section End */}

            <div className='container'>
                <div className='row'>
                    <div className='col-md-4 col-sm-12'>   v 
                        <form>
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <div className="input-daterange" id="datepicker">
                                        <div className="input-group">
                                            <input className="form-control input-lg" type="text" placeholder="Start Date" name="start" />
                                            <span className="input-group-addon">TO</span>
                                            <input className="form-control input-lg" type="text" placeholder="End Date" name="end" />
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



                        <form action="" method="post">
                            <div className="row">
                                <div className="col-sm-12">
                                    <input className="form-control input-lg" type="text" placeholder="Search By Email" name="mail" style={{textAlign: "center"}} />
                                </div>
                                <div className="col-sm-12"><br />
                                    <button type="submit" name="mma" className="btn btn-success btn-block" style={{ backgroundColor: "#5cb85c" }}> SEARCH</button>
                                </div>
                            </div>
                        </form>



                    </div>
                </div>
            </div>
            <div style={{minHeight: "40px"}}></div>
            <div className='container'>
            <div className='row'>
            <div className='col-md-12 col-sm-12'>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td scope="row" style={{ color: "#727272" ,fontSize: "18px" ,textTransform: "uppercase", fontWeight:"300"}}>13
                                        <br/>Sep</td>
                                        <td style={{ color: "#727272" ,fontSize: "14px" , fontWeight:"300"}}>	Withdraw By PayPal</td>
                                        <td style={{textAlign:"right", color: "#727272" ,fontSize: "20px"}}><b> $ 200.00</b> </td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                    <td scope="row" style={{ color: "#727272" ,fontSize: "18px" ,textTransform: "uppercase", fontWeight:"300"}}>13
                                        <br/>Sep</td>
                                        <td style={{ color: "#727272" ,fontSize: "14px" , fontWeight:"300"}}>	Withdraw By PayPal</td>
                                        <td style={{textAlign:"right", color: "#727272" ,fontSize: "20px"}}><b> $ 200.00</b> </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>
                        </div>
        </>
    );
}
