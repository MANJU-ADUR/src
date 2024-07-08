import React from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import "../CSS/HrNavbar.css"

const HrNavbar = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const handleLogout = () => {
        localStorage.removeItem('User');
    };

    return (
        <div className="hr_navbar">
            <div className="nav">
                <nav>
                    <Link to="/hr-dash/goals">Awaited Goals</Link>
                    <Link to="/hr-dash/hr-reviewed-goals">Reviewed Goals</Link>
                </nav>

                <div className="logo">
                    <h2><b>Quantum Technologies</b></h2>
                </div>
                <div className="username">
                    <CgProfile />
                    <p>{user.firstname} {user.lastname}</p>
                    <Link to="/">
                        <button>Logout</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HrNavbar;
