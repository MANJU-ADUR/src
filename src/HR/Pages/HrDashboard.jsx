import React, { useEffect } from 'react'
import HrNavbar from './HrNavbar'
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import EmpGoals from './EmpGoals';
import GoalDetail from './GoalDetail';
import HrReviewedGoals from "./HrReviewedGoals"

const HrDashboard = () => {

    const hr = JSON.parse(localStorage.getItem("User"))
    console.log(hr.id);
    const email = hr.email
    const password = hr.password
    console.log(email, password);
    useEffect(() => {
        const fetchHr = async () => {
            try {
                const response = await axios.post(`http://localhost:7410/hr/find-by-email-password?email=${email}&password=${password}`);
                console.log(response.data.data);
                localStorage.setItem("Hr", JSON.stringify(response.data.data))
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchHr();
    }, []);
    return (
        <div className="hrdash">
            <HrNavbar />
            <Routes>
                <Route path='/goals' element={<EmpGoals />} />
                <Route path='/goal-detail/:id' element={<GoalDetail />} />
                <Route path='/hr-reviewed-goals' element={<HrReviewedGoals />} />

            </Routes>
        </div>
    )
}

export default HrDashboard