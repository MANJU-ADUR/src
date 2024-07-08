import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spin } from 'antd';
import "../CSS/GoalsByEmp.css";
import { useNavigate } from 'react-router-dom';

const GoalsByEmp = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const manager = JSON.parse(localStorage.getItem("manager"));
    console.log(manager);
    // console.log(manager.id);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get(`http://localhost:7410/setgoals/employee-goals/${manager.id}`);
                console.log(response.data); // Log the response data to verify

                if (response.data.statuscode === 200) {
                    setGoals(response.data.data); // Assuming goals data is in response.data.data
                    console.log(response.data.data);
                    setLoading(false);
                    setError(null);
                } else {
                    setError(response.data.message);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching goals:', error);
                setError('Failed to fetch goals. Please try again later.');
                setLoading(false);
            }
        };

        fetchGoals();
    }, []); // Empty dependency array ensures this runs only once on component mount

    const navigate = useNavigate()
    const displaygoal = (goal_id) => {

        navigate(`/manager-dash/goal-detail/${goal_id}`)
    }
    return (
        <div className="divv">
            <br />
            <div className="empgoals">
                <h2>Goals Submitted by Employees</h2>
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <p>Error: {error}</p>
                ) : goals.length === 0 ? (
                    <p id="error">No goals submitted by employees.</p>
                ) : (
                    <div className="goal-cards-container">
                        {goals.map(goal => (
                            <Card key={goal.id} title={goal.title} style={{ marginBottom: 20 }}>
                                {/* Uncomment and modify as needed */}
                                {/* <p><strong>Description:</strong> {goal.description}</p> */}
                                <p><strong>Start Date:</strong> {goal.startdate}</p>
                                <p><strong>End Date:</strong> {goal.enddate}</p>
                                {/* <p><strong>Status:</strong> {goal.status}</p> */}
                                {/* Display other relevant fields as needed */}
                                <button onClick={() => { displaygoal(goal.goal_id) }} >
                                    View Goal
                                </button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalsByEmp;
