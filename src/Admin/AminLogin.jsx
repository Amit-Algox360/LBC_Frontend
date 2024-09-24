import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../HomeCommon/Header";
import axios from 'axios'; 
import { API_BASE_URL } from "../Api/data";
import { API_LIVE_URL } from "../Api/data";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Adminlogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
   try{
    const response = await axios.post(`${API_LIVE_URL}auth/login`,{
      email : email,
      password : password
    })
    if (response.data.status === 401){
      setError(response.data.message)
    } else if(response.data.status === 201){
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      toast.success('Sucessfull Login')
      navigate('/admin')
    }
   }catch(error){
    toast.error('Login Failed')
   }
 
  };

  return (
    <>
    <Header/>
    <section className="py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card border border-light-subtle rounded-3 shadow-sm">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="text-center mb-3">
                  <a href="#!">{/* Your logo */}</a>
                </div>
                <h2 className="text-center  mb-4" style={{ fontSize: '500' }}>
                  <b>Admin Login Form</b>
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-2 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-2 justify-content-between">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            name="rememberMe"
                            id="rememberMe"
                            // Handle Remember Me checkbox if needed
                          />
                          <label className="form-check-label text-secondary" htmlFor="rememberMe">
                            Keep me logged in
                          </label>
                        </div>
                        <Link to="/forgot-password" className="link-primary text-decoration-none">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    {error && <div className="col-12 text-danger">{error}</div>}
                    <div className="col-12">
                      <div className="d-grid my-3">
                        <button className="btn btn-primary btn-lg" type="submit">
                          Log in
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <p className="m-0 text-secondary text-center">
                        Don't have an account? <Link to="/register" className="link-primary text-decoration-none">Sign up</Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Adminlogin;
