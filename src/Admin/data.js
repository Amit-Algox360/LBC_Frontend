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
      <Header />
      <div className="container">
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
    </>
  );
};

export default Data;
