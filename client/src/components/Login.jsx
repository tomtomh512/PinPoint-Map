import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import httpClient from "../httpClient";
import "../styles/Authentication.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const logInUser = async (event) => {
        event.preventDefault();

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
            <h1> Login </h1>

            <form>
                <label> Enter username </label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id=""
                />
                <br/>

                <label> Enter password </label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id=""
                />

            </form>

            <button onClick={logInUser} className="login-logout-button"> Login</button>

            <br/>
            {alertMessage}

            <Link to="/profile" className="login-register-back-link"> Back </Link>
        </div>
    );
}
