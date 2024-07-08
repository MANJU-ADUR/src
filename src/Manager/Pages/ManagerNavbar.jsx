import React from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import Login from '../../Landing_Components/Pages/Login';
import "../CSS/ManagerNavbar.css"

const ManagerNavbar = () => {
    const manager = JSON.parse(localStorage.getItem('User'));

    // Conditionally render based on user data
    if (!manager || !manager.firstname || !manager.lastname) {
        // Render a placeholder or redirect to login
        return (
            <div className="emp_navbar">
                <Login />
            </div>
        );
    }

    // User data is valid, construct username
    const managername = `${manager.firstname} ${manager.lastname}`;

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('User');
        // Redirect to login page or perform other actions after logout
        // Example: window.location.href = '/login';
    };

    return (
        <div className="mgr_navbar">
            <div className="nav">
                <nav>
                    <Link to="/manager-dash/employee-goals">Awaited Goals</Link>
                    <Link to="/manager-dash/reviewed-goals">Reviewed Goals</Link>
                </nav>
                <div className="logo"><h2><b>Quantum Technologies</b></h2></div>
                <div className="username">
                    <CgProfile />
                    {managername} {/* Render the employee's name */}
                    <Link to="/">
                        <button>Logout</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ManagerNavbar;
