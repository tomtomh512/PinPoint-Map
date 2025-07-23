import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import '../styles/Authentication.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const logInUser = async (event) => {
        event.preventDefault();

        const formDetails = new URLSearchParams();
        formDetails.append('username', username);
        formDetails.append('password', password);

        try {
            const response = await httpClient.post(
                `${process.env.REACT_APP_SERVER_API_URL}/auth/login`,
                formDetails,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            localStorage.setItem('token', response.data.access_token);
            navigate('/profile');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                setAlertMessage(error.response.data.detail);
            } else {
                setAlertMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="login-register-container main-content-element">
            <h1>Login</h1>

            <form onSubmit={logInUser}>
                <label>Enter username</label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />

                <label>Enter password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br />
                <button type="submit" className="login-logout-button">
                    Login
                </button>
            </form>

            {alertMessage && <p className="error-message">{alertMessage}</p>}

            <Link to="/profile" className="login-register-back-link">
                Back
            </Link>
        </div>
    );
}
