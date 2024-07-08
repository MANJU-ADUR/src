import React, { useState, useEffect } from 'react';
// import '../CSS/ReviewedGoals.css'
import { useNavigate } from 'react-router-dom';
const ReviewedGoals = () => {
    const [goals, setGoals] = useState([]);
    const Hr = JSON.parse(localStorage.getItem("Hr"));

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch(`http://localhost:7410/goals/find-by-hr/${Hr.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch goals');
                }
                const data = await response.json();
                // const filteredGoals = data.data.filter(goal => goal.status === "managerA");
                setGoals(data.data);
                console.log(data.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };

        fetchGoals();
    }, [Hr.id]);

    const navigate = useNavigate()
    const viewgoal = (id) => {
        navigate(`/hr-dash/reviewed/${id}`)
    }
    return (
        <div className="goal-detail-container reviewed-goals">
            <h2>Reviewed Goals</h2>
            <ul>
                {goals.map(goal => (
                    <li key={goal.id}>
                        <h3>{goal.title}</h3>
                        {/* <p><strong>Description:</strong> {goal.description}</p> */}
                        <p><strong>Start Date:</strong> {goal.startdate}</p>
                        <p><strong>End Date:</strong> {goal.enddate}</p>
                        <button onClick={() => { viewgoal(goal.id) }} >
                            View Goal
                        </button>
                        {/* Add more fields as needed */}
                    </li>
                ))}

            </ul>

        </div>
    );
};

export default ReviewedGoals;
