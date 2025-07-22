import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import httpClient from "../httpClient";
import "../styles/Authentication.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setAlertMessage("Passwords do not match");
            return;
        }

        try {
            await httpClient.post(`${process.env.REACT_APP_SERVER_API_URL}/register`, {
                username,
                password,
            });

            navigate("/profile");

        } catch (error) {
            setAlertMessage(error.response.data.message);
        }
    };

    return (
        <div className="login-register-container main-content-element">
            <h1> Register </h1>

            <form>
                <label> Enter username </label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br/>
                <label> Enter password </label>
                <input
                    type="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>

                <label> Confirm username </label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

            </form>
            <button onClick={registerUser} className="login-logout-button">Register</button>

            <br/>

            {alertMessage}

            <Link to="/profile" className="login-register-back-link"> Back </Link>

        </div>
    );
}
