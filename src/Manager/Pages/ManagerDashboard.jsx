import React, { useEffect, useState } from 'react';
import ManagerNavbar from './ManagerNavbar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import GoalsByEmp from './GoalsByEmp';
import axios from 'axios'; // Import axios for making HTTP requests
import GoalDetail from './GoalDetail';
import ReviewedGoals from './ReviewedGoals';
import ReviewedDetail from './ReviewedDetail';

const ManagerDashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dummymgr = JSON.parse(localStorage.getItem("User"))
    console.log(dummymgr);
    const email = dummymgr.email
    const password = dummymgr.password

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.post(`http://localhost:7410/manager/find-by-email-password?email=${email}&password=${password}`);
                console.log('User details:', response.data);
                setUserDetails(response.data); // Assuming response.data contains user details
                localStorage.setItem("manager", JSON.stringify(response.data.data))
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Failed to fetch user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="managerdash">
            <ManagerNavbar />
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : userDetails ? (
                <div>
                    {/* Render other components and routes */}
                    <Routes>
                        <Route path='/employee-goals' element={<GoalsByEmp />} />
                        <Route path='/goal-detail/:id' element={<GoalDetail />} />
                        <Route path='/reviewed-goals' element={<ReviewedGoals />} />
                        <Route path='/reviewed/:id' element={<ReviewedDetail />} />
                    </Routes>
                </div>
            ) : (
                <p>No user details found.</p>
            )}
        </div>
    );
};

export default ManagerDashboard;
