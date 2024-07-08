import React from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import '../CSS/EmployeeNavbar.css';
import Login from '../../Landing_Components/Pages/Login';

const EmployeeNavbar = () => {
    const employee = JSON.parse(localStorage.getItem('User'));

    // Conditionally render based on user data
    if (!employee || !employee.firstname || !employee.lastname) {
        // Render a placeholder or redirect to login
        return (
            <div className="emp_navbar">
                <Login />
            </div>
        );
    }

    // User data is valid, construct username
    const employeeName = `${employee.firstname} ${employee.lastname}`;

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('User');
        // Redirect to login page or perform other actions after logout
        // Example: window.location.href = '/login';
    };

    return (
        <div className="emp_navbar">
            <div className="nav">
                <nav>
                    <Link to="/employee-dash/create">Create</Link>
                    <Link to="/employee-dash/my-goals">My Goals</Link>
                    {/* <Link to="/employee-dash/goals-status">Goals Status</Link> */}
                </nav>
                <div className="logo"><h2><b>Quantum Technologies</b></h2></div>
                <div className="username">
                    <CgProfile />
                    {employeeName} {/* Render the employee's name */}
                    <Link to="/">
                        <button>Logout</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeNavbar;
