import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../CSS/Login.css";
import logo from "../../Assests/logo_trans1.png";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const handleSignup = async () => {
    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        firstName,
        lastName,
        dob,
        gender,
        email,
        password,
      });
      alert("Signup successful!");
      navigate("/dashboard"); // Redirect to login page after successful signup
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
        <img src={logo} alt="Twokey Logo" className="logo-image" />
        </div>
        <h2>Create your TwoKey Account</h2>

        <div className="name-inputs">
          <input
            className="login-input"
            placeholder="First name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="login-input"
            placeholder="Last name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          className="login-input"
          type="date"
          placeholder="Date of Birth"
          onChange={(e) => setDob(e.target.value)}
        />
        <select
          className="login-input"
          onChange={(e) => setGender(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          className="login-input"
          placeholder="Gmail"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            className="login-input"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <EyeOff className="eye-icon" onClick={togglePasswordVisibility} />
          ) : (
            <Eye className="eye-icon" onClick={togglePasswordVisibility} />
          )}
        </div>
        <div className="password-container">
          <input
            className="login-input"
            type={showRePassword ? "text" : "password"}
            placeholder="Re-type Password"
            onChange={(e) => setRePassword(e.target.value)}
          />
          {showRePassword ? (
            <EyeOff className="eye-icon" onClick={toggleRePasswordVisibility} />
          ) : (
            <Eye className="eye-icon" onClick={toggleRePasswordVisibility} />
          )}
        </div>

        <div className="actions">
          <span className="link" onClick={() => navigate("/login")}>
            Sign in instead
          </span>
          <button className="login-button" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
