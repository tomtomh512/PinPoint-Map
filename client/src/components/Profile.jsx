import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../httpClient';
import '../styles/Profile.css';

export default function Profile(props) {
    const { user, setUser, setCurrentMarkers } = props;

    // Clear markers when user is on profile page
    useEffect(() => {
        setCurrentMarkers([]);
    }, [setCurrentMarkers]);

    // Verify user token
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser({ id: null, username: null });
                return;
            }

            try {
                const response = await httpClient.get(
                    `${process.env.REACT_APP_SERVER_API_URL}/auth/verify-token/${token}`
                );

                console.log('Token is valid:', response.data);
                setUser({ id: response.data.id, username: response.data.username });
            } catch (error) {
                console.log('Token invalid or expired:', error);
                localStorage.removeItem('token');
                setUser({ id: null, username: null });
            }
        };

        verifyToken();
    }, [setUser]);

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser({ id: null, username: null });
    };

    return (
        <div className="profile-container main-content-element">
            <h1>Profile</h1>

            {user.id && user.username ? (
                <>
                    <h2>Welcome, {user.username}</h2>

                    <section className="view-lists">
                        <Link to="/favorites" className="view-lists-button">
                            View Favorites
                        </Link>
                        <Link to="/planned" className="view-lists-button">
                            View Planned
                        </Link>
                    </section>

                    <button onClick={logoutUser} className="login-logout-button">
                        Log Out
                    </button>
                </>
            ) : (
                <>
                    <h2>You are not logged in</h2>
                    <Link to="/login" className="login-logout-button">
                        Login
                    </Link>
                    <Link to="/register" className="register-link">
                        Register
                    </Link>
                </>
            )}
        </div>
    );
}
