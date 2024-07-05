import Header from "../Common/Header";
import Footer from "../Common/Footer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../Api/data";
// import Select from "react-select";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    mobile: "",
    country: "",
    pincode: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      mobile: "",
      country: "",
      pincode: "",
      userName: "",
      password: "",
      confirmPassword: "",
    });
    const isValid = validateForm(formData);

    if (isValid) {
      try {
        const response = await fetch(`${API_BASE_URL}/user/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Registration successful");
          setRegistrationSuccess(true);
        } else {
          toast.error("Registration failed");
        }
      } catch (error) {
        toast.error("Error during registration");
      }
    } else {
      toast.error("Form is invalid. Please check the errors.");
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is Required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is Required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (!formData.countryCode.trim()) {
      errors.countryCode = "CountryCode is Required";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile Number is Required";
    }
    if (!formData.country.trim()) {
      errors.country = "Country is Required";
    }

    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is Required";
    }

    if (!formData.userName.trim()) {
      errors.userName = "UserName is Required";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // Country Api
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  // useEffect(() => {
  //   fetch(
  //     "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCountries(data.countries);
  //       setSelectedCountry(data.userSelectValue);
  //     });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        );
        const data = response.data;
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Header />
      <div className="py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
              <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                <div className="row">
                  <div className="col-12">
                    <div className="text-center mb-5">
                      <a href="#!">
                        {/* <img src="./assets/img/bsb-logo.svg" alt="BootstrapBrain Logo" width="175" height="57"> */}
                      </a>
                    </div>
                  </div>
                </div>
                <h2 className="text-center  mb-4" style={{ fontSize: "500" }}>
                  <b>Registration Form</b>
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden">
                    <div className="form-css">
                      <div className="col-6 p-2">
                        <label htmlFor="firstName" className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-person-vcard"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                              <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.firstName ? "is-invalid" : ""
                            }`}
                            name="firstName"
                            id="firstName"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="col-6 p-2
                      
                      "
                      >
                        <label htmlFor="lastName" className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-person-vcard"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                              <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.lastName ? "is-invalid" : ""
                            }`}
                            name="lastName"
                            id="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <label htmlFor="firstName" className="form-label">
                        pincode <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-person-vcard"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12z" />
                          </svg>
                        </span>
                        <input
                          type="tel"
                          pattern="[0-9]*"
                          className={`form-control ${
                            errors.pincode ? "is-invalid" : ""
                          }`}
                          name="pincode"
                          id="pincode"
                          placeholder="Enter your pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                        />
                        {errors.pincode && (
                          <div className="invalid-feedback">
                            {errors.pincode}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="userId" className="form-label">
                        User Id <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i
                            className="fa-regular fa-user"
                            style={{ color: "#212121" }}
                          ></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.userName ? "is-invalid" : ""
                          }`}
                          name="userName"
                          id="userName"
                          placeholder="Enter your user id"
                          value={formData.userName}
                          onChange={handleChange}
                        />
                        {errors.userName && (
                          <div className="invalid-feedback">
                            {errors.userName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-envelope"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          name="email"
                          id="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="mobileNumber" className="form-label">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i
                            className="fa-solid fa-phone"
                            style={{ color: "#050505" }}
                          ></i>
                        </span>
                        <input
                          type="tel"
                          pattern="[0-9]*"
                          className={`form-control ${
                            errors.mobile ? "is-invalid" : ""
                          }`}
                          name="mobile"
                          id="mobile"
                          placeholder="Enter your mobile number"
                          value={formData.mobile}
                          onChange={handleChange}
                        />
                        {errors.mobile && (
                          <div className="invalid-feedback">
                            {errors.mobile}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-css">
                      <div className="col-6">
                        <label htmlFor="firstName" className="form-label">
                          Country <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i
                              className="fa-solid fa-earth-americas"
                              style={{ color: "#000000" }}
                            ></i>
                          </span>
                          <div className="form-group">
                            <select
                              className={`form-control ${
                                errors.country ? "is-invalid" : ""
                              }`}
                              id="exampleFormControlSelect1"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                            >
                              {errors.country && (
                                <div className="invalid-feedback">
                                  {errors.country}
                                </div>
                              )}
                              <option>--Please Select--</option>
                              <option>India</option>
                              <option>Australia</option>
                              <option>US</option>
                              <option>South Africa</option>
                            </select>
                            {/* <Select
                              id="country"
                              // className="form-control"
                              options={countries}
                              value={selectedCountry}
                              onChange={(selectedOption) => setSelectedCountry(selectedOption)}

                            >

                            </Select> */}
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <label htmlFor="Number" className="form-label">
                          Pin Code <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i
                              className="fa-solid fa-earth-americas"
                              style={{ color: "#000000" }}
                            ></i>
                          </span>
                          <input
                            type="tel"
                            pattern="[0-9]*"
                            className={`form-control ${
                              errors.countryCode ? "is-invalid" : ""
                            }`}
                            name="countryCode"
                            id="countryCode"
                            placeholder="Enter your pincode"
                            value={formData.countryCode}
                            onChange={handleChange}
                          />
                          {errors.countryCode && (
                            <div className="invalid-feedback">
                              {errors.countryCode}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-key"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </span>
                        <input
                          className={`form-control input-lg required jobsearch_chk_passfield ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          name="password"
                          type="password"
                          placeholder="Password *"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <span className="passlenth-chk-msg"></span>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label For="password" className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-key"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </span>
                        <input
                          className={`form-control input-lg required ${
                            errors.confirmPassword ? "is-invalid" : ""
                          }`}
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm Password *"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          name="iAgree"
                          id="iAgree"
                          required
                        />
                        <label
                          className="form-check-label text-secondary"
                          htmlFor="iAgree"
                        >
                          I agree to the{" "}
                          <a
                            href="#!"
                            className="link-primary text-decoration-none"
                          >
                            terms and conditions
                          </a>
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          className="btn btn-primary btn-lg"
                          type="submit"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12">
                    <hr className="mt-5 mb-4 border-secondary-subtle" />
                    <p className="m-0 text-secondary text-center">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="link-primary text-decoration-none"
                      >
                        Sign in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
