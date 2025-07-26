import React, { useEffect, useState } from "react";
import Listings from "./Listings";
import "../styles/UserLists.css";
import { Link } from "react-router-dom";
import httpClient from "../httpClient";
import {getToken} from "../utils/tokenUtils";

export default function UserList(props) {
    const {
        user,
        setCurrentMarkers,
        selectedLocation,
        setSelectedLocation,
        type,  // "favorite" or "planned"
    } = props;

    const [listResults, setListResults] = useState([]);
    const [filters, setFilters] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filtersInUse, setFiltersInUse] = useState([]);

    useEffect(() => {
        setSelectedLocation({});
    }, [setSelectedLocation]);

    const fetchList = async () => {
        if (user.id && user.username) {
            try {
                // Adjusted endpoint to unified userlist route
                const response = await httpClient.get(
                    `${process.env.REACT_APP_SERVER_API_URL}/userlist`,
                    {
                        params: {
                            filters: filtersInUse,
                            type: type,
                        },
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );
                setListResults(response.data);
                setCurrentMarkers(response.data);

            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
            }
        }
    };

    const fetchCategories = async () => {
        if (user.id && user.username) {
            try {
                // Unified categories endpoint if you have one, otherwise separate by type
                const response = await httpClient.get(
                    `${process.env.REACT_APP_SERVER_API_URL}/userlist/categories`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setFilters(response.data.categories);

            } catch (error) {
                console.error(`Error fetching ${type} categories:`, error);
            }
        }
    };

    useEffect(() => {
        setCurrentMarkers(listResults);
    }, [listResults, setCurrentMarkers]);

    useEffect(() => {
        fetchList();
        fetchCategories();
    }, [setCurrentMarkers, filtersInUse, user.id, user.username, type]);

    // Feedback message
    const [message, setMessage] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage("");
        }, 2000);

        return () => clearTimeout(timer);
    }, [message]);

    const handleFilterChange = (event) => {
        const filterName = event.target.name;
        const isChecked = event.target.checked;

        setFiltersInUse((prevFiltersInUse) => {
            if (isChecked) {
                return [...prevFiltersInUse, filterName];
            } else {
                return prevFiltersInUse.filter((filter) => filter !== filterName);
            }
        });
    };

    return (
        <div className="userlist-container main-content-element">
            <h1>{type}</h1>
            {user.id && user.username ? (
                <>
                    {listResults.length === 0 ? (
                        <h3 className="no-results-message"> Nothing to display </h3>
                    ) : (
                        <>
                            {!showFilters ? (
                                <span
                                    className="filter-toggle"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    Show Filters
                                </span>
                            ) : (
                                <>
                                    <span
                                        className="filter-toggle"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        Hide Filters
                                    </span>

                                    <form className="filter-form">
                                        {filters.map((filter) => (
                                            <div className="filter-box" key={filter.id}>
                                                <input
                                                    type="checkbox"
                                                    name={filter.name}
                                                    onChange={handleFilterChange}
                                                    checked={filtersInUse.includes(filter.name)}
                                                />
                                                <label>{filter.name}</label>
                                            </div>
                                        ))}
                                    </form>
                                </>
                            )}

                            {message !== "" && <p className="feedback-message">{message}</p>}

                            <Listings
                                user={user}
                                listings={listResults}
                                setListings={setListResults}
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                setMessage={setMessage}
                            />
                        </>
                    )}
                </>
            ) : (
                <>
                    <h2> Log in to save to {type} </h2>
                    <Link to="/profile" className="login-logout-button">
                        Login
                    </Link>
                </>
            )}
        </div>
    );
}
