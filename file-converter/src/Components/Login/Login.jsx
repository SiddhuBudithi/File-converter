import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../CSS/Login.css";
import logo from "../../Assests/logo_trans1.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            alert("Login successful!");
            navigate("/dashboard"); 
        } catch (error) {
            alert("Login failed!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <img src={logo} alt="Twokey Logo" className="logo-image" />
                </div>
                <h2>Sign in</h2>
                <p>With your TwoKey Account</p>
                <input 
                    className="login-input" 
                    type="text" 
                    placeholder="Email or phone" 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <div className="options">
                    <span className="link" onClick={() => navigate("/forgot-email")}>Forgot email?</span>
                </div>
                <div className="password-container">
                    <input
                        className="login-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {showPassword ? (
                        <EyeOff className="eye-icon" onClick={togglePasswordVisibility} />
                    ) : (
                        <Eye className="eye-icon" onClick={togglePasswordVisibility} />
                    )}
                </div>
                <div className="actions">
                    <span className="link" onClick={() => navigate("/signup")}>Create account</span>
                    <button className="login-button" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
