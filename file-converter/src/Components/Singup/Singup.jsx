import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
            alert("Signup successful!");
        } catch (error) {
            alert("Signup failed!");
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default Signup;
