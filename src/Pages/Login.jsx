import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_LIVE_URL } from '../Api/data';
import { API_BASE_URL } from '../Api/data';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_LIVE_URL}auth/login`, {
      email: email,
      password: password
    })
    .then(result => {
      if (result.data.status === 401) {
        toast.error(result.data.message);
      } else if (result.data.status === 404) {
        toast.error('User not registered');
      } else if (result.data.status === 201) {
        toast.success('Successfully Logged In');
        localStorage.setItem('customerId',result.data.response.customerId)
        localStorage.setItem('userId', result.data.response._id);
        localStorage.setItem('token', result.data.token); 
        navigate('/main');
      }
    })
    .catch(error => {
      toast.error('Login Failed');
    });
  };

  return (
    <>
      <Header />
      <section className="py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              <div className="card border border-light-subtle rounded-3 shadow-sm">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="text-center mb-3">
                    <a href="#!">{/* Your logo */}</a>
                  </div>
                  <h2 className="text-center mb-4" style={{ fontSize: '500' }}>
                    <b>Login Form</b>
                  </h2>
                  <form>
                    <div className="row gy-2 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            value={email}
                            onChange={handleEmail}
                            required
                          />
                          <label htmlFor="email" className="form-label">Email</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            value={password}
                            onChange={handlePassword}
                            required
                          />
                          <label htmlFor="password" className="form-label">Password</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex gap-2 justify-content-between">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="rememberMe"
                              id="rememberMe"
                            />
                            <label className="form-check-label text-secondary" htmlFor="rememberMe">
                              Keep me logged in
                            </label>
                          </div>
                          <a href="#!" className="link-primary text-decoration-none">
                            Forgot password?
                          </a>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid my-3">
                          <button className="btn btn-primary btn-lg" type="submit" onClick={handleSubmit}>
                            Log in
                          </button>
                        </div>
                      </div>
                      <div className="col-12">
                        <p className="m-0 text-secondary text-center">
                          Don't have an account? <a href="register" className="link-primary text-decoration-none">Sign up</a>
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
      <Footer />
    </>
  );
}

export default Login;
