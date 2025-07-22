import React, {useEffect, useState} from "react";
import Listings from "./Listings";
import "../styles/UserLists.css";
import {Link} from "react-router-dom";
import httpClient from "../httpClient";

export default function Planned(props) {
    const {
        user,
        setCurrentMarkers,
        selectedLocation, setSelectedLocation,
    } = props;

    const [searchPlannedResults, setSearchPlannedResults] = useState([]);
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [filtersInUse, setFiltersInUse] = useState([]);

    useEffect(() => {
        setSelectedLocation({})
    }, [setSelectedLocation]);

    const fetchPlanned = async () => {
        if (user.id && user.username) {
            try {
                const response = await httpClient.get("http://localhost:5000/planned", {
                    params: {
                        filters: filtersInUse
                    }
                });
                setSearchPlannedResults(response.data.results);
                setCurrentMarkers(response.data.results);

            } catch (error) {
                console.error("Error fetching planned locations:", error);
            }
        }
    };

    const fetchCategories = async () => {
        if (user.id && user.username) {
            try {
                const response = await httpClient.get("http://localhost:5000/planned/categories");
                setFilters(response.data.categories);

            } catch (error) {
                console.error("Error fetching favorites categories:", error);
            }
        }
    };

    useEffect(() => {
        setCurrentMarkers(searchPlannedResults);

    }, [searchPlannedResults, setCurrentMarkers]);

    useEffect(() => {
        fetchPlanned();
        fetchCategories();

    }, [setCurrentMarkers, filtersInUse, user.id, user.username]);

    // Feedback message
    const [message, setMessage] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage(""); // Clear the message after 2 seconds
        }, 2000);

        return () => clearTimeout(timer);
    }, [message]);

    const handleFilterChange = (event) => {
        const filterName = event.target.name;
        const isChecked = event.target.checked;

        setFiltersInUse((prevFiltersInUse) => {
            if (isChecked) {
                return [...prevFiltersInUse, filterName]; // Add the filter to the array
            } else {
                return prevFiltersInUse.filter((filter) => filter !== filterName); // Remove the filter from the array
            }
        });
    };

    return (
        <div className="planned-container main-content-element">
            <h1> Planned </h1>
            {user.id && user.username ?
                <>
                    {searchPlannedResults.length === 0 ?
                        // If no results, display message, else show num results and render listings
                        <h3 className="no-results-message"> Nothing to display </h3>
                        :
                        <>
                            {!showFilters ?
                                <span className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                                    Show Filters
                                </span>
                                :
                                <>
                                    <span className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
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
                            }

                            {message !== "" ? <p className="feedback-message"> {message} </p> : ""}

                            <Listings
                                user={user}
                                listings={searchPlannedResults}
                                setListings={setSearchPlannedResults}
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                setMessage={setMessage}
                            />
                        </>
                    }
                </>
                :
                <>
                    <h2> Log in to save to planned </h2>
                    <Link to="/profile" className="login-logout-button"> Login </Link>
                </>
            }
        </div>
    );
}