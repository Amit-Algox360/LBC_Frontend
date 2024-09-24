import React, { useEffect, useState } from "react";
import Header from "./header";
import { API_BASE_URL } from "../Api/data";
import { API_LIVE_URL } from "../Api/data";
import axios from "axios";
import { Link} from "react-router-dom";

const Data = () => {
  const [ticket, setTicket] = useState([]);


  // All Ticket Get Api
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        };
        const response = await axios.get(
          `${API_LIVE_URL}ticket/read`,
          { headers }
        );
        setTicket(response.data.response);
        console.log("===>", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);


  // Ticket Delete Api 
  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm("Would you like to delete?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        };
        await axios.delete(
          `${API_LIVE_URL}ticket/delete?ticketId=${_id}`,
          { headers }
        );
        setTicket(ticket.filter((ticket) => ticket._id !== _id));
      } catch (error) {
        console.log(error);
      }
    }
  };


  // All Ticket Update Api
  const handleStatusChange = async (_id, status) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      };
      await axios.put(
        `${API_LIVE_URL}ticket/update`,
        { ticketId: _id, status: status.toString() },
        { headers }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
      <Header />
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item d-block d-xl-none">
              <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" href="javascript:void(0)">
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-icon-hover" href="javascript:void(0)">
                <i className="ti ti-bell-ringing"></i>
                <div className="notification bg-primary rounded-circle"></div>
              </a>
            </li>
          </ul>
          <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
            <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
   
              <li className="nav-item dropdown">
                <a className="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img src="https://img.hotimg.com/logo-181c65d1a63a3cafe.png" alt="image" width="35" height="35" className="rounded-circle"/>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                  <div className="message-body">
                    <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-user fs-6"></i>
                      <p className="mb-0 fs">My Profile</p>
                    </a>
                    <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-mail fs-6"></i>
                      <p className="mb-0 fs">My Account</p>
                    </a>
                    <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-list-check fs-6"></i>
                      <p className="mb-0 fs">My Task</p>
                    </a>
                    <a 
                     onClick={() => {
                      localStorage.removeItem("token");
                    }}
                     href="/" className="btn btn-outline-primary mx-3 mt-2 d-block">Logout</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      
      <div className="container-lg"style={{maxWidth:"50%"}}>
        <div className="row">
          <div className=" d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4">Ticket Details</h5>
                <span>
                  <Link to="/createticket" className="btn btn-success mb-3">
                    Add++
                  </Link>
                </span>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Ticket Amount</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Action</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticket.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <h6 className="fw-semibold mb-0 fs-4">
                              {item ? item.amount : "Invalid ticket data"}
                            </h6>
                          </td>
                          <td className="border-bottom-0">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`status-${item ? item._id : index}`}
                                id={`active-${item ? item._id : index}`}
                                checked={item && item.active === true}
                                onChange={() => handleStatusChange(item._id, true)}
                                disabled={!item}
                              />
                              <label className="form-check-label" htmlFor={`active-${item ? item._id : index}`}>
                                Active
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`status-${item ? item._id : index}`}
                                id={`inactive-${item ? item._id : index}`}
                                checked={item && item.active === false}
                                onChange={() => handleStatusChange(item._id, false)}
                                disabled={!item}
                              />
                              <label className="form-check-label" htmlFor={`inactive-${item ? item._id : index}`}>
                                Inactive
                              </label>
                            </div>
                            {item && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="btn btn-sm btn-danger ms-3"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Data;
