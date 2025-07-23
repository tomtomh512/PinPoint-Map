import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import httpClient from '../httpClient';
import '../styles/Authentication.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setAlertMessage('Passwords do not match');
            return;
        }

        try {
            await httpClient.post(`${process.env.REACT_APP_SERVER_API_URL}/auth/register`, {
                username,
                password,
            });

            const loginData = new URLSearchParams();
            loginData.append('username', username);
            loginData.append('password', password);

            const loginResponse = await httpClient.post(
                `${process.env.REACT_APP_SERVER_API_URL}/auth/login`,
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            localStorage.setItem('token', loginResponse.data.access_token);
            navigate('/profile');
        } catch (error) {
            if (error.response?.data?.detail) {
                setAlertMessage(error.response.data.detail);
            } else {
                setAlertMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="login-register-container main-content-element">
            <h1>Register</h1>

            <form onSubmit={registerUser}>
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

                <label>Confirm password</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <br />

                <button type="submit" className="login-logout-button">Register</button>
            </form>

            {alertMessage && <p className="error-message">{alertMessage}</p>}

            <Link to="/profile" className="login-register-back-link">
                Back
            </Link>
        </div>
    );
}
