import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import axios from 'axios';
import '../CSS/DraftGoals.css'; // Adjust path to your CSS file
import { Link, useNavigate } from 'react-router-dom';

const DraftGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [managers, setManagers] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState({});

    useEffect(() => {
        const employee = JSON.parse(localStorage.getItem('employee'));

        const fetchManagers = async () => {
            try {
                const response = await axios.get(`http://localhost:7410/manager/managers`);
                setManagers(response.data.data);
            } catch (error) {
                console.error('Error fetching managers:', error);
                setError('Failed to fetch managers.');
            }
        };

        const fetchGoals = async (employeeId) => {
            try {
                const response = await axios.get(`http://localhost:7410/goals/goals-by-employee/${employeeId}`);
                if (response.data.statuscode === 200) {
                    const normalizedGoals = response.data.data.map(goal => ({
                        ...goal,
                        status: goal.status.trim().toLowerCase()
                    }));
                    const filteredGoals = normalizedGoals.filter(goal => goal.status === 'draft');

                    const initialSelectedManagers = filteredGoals.reduce((acc, goal) => {
                        acc[goal.id] = null;
                        return acc;
                    }, {});
                    setSelectedManagers(initialSelectedManagers);

                    setGoals(filteredGoals);
                    if (filteredGoals.length === 0) {
                        setError("No draft goals found for the employee.");
                    } else {
                        setError(null);
                    }
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching goals:', error);
                setError('Failed to show goals. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (employee && employee.id) {
            fetchManagers();
            fetchGoals(employee.id);
        } else {
            setLoading(false);
        }
    }, []);

    const handleManagerSelect = (event, goalId) => {
        const selectedId = parseInt(event.target.value, 10);
        const selectedManagerData = managers.find(manager => manager.id === selectedId);

        setSelectedManagers(prevState => ({
            ...prevState,
            [goalId]: selectedManagerData,
        }));
    };

    const handleSendButtonClick = async (goalId) => {
        const selectedManager = selectedManagers[goalId];
        const employee = JSON.parse(localStorage.getItem('employee'));
        const goalToSend = goals.find(goal => goal.id === goalId);

        const dataToSend = {
            goal_id: goalToSend.id,
            title: goalToSend.title,
            description: goalToSend.description,
            startdate: goalToSend.startdate,
            enddate: goalToSend.enddate,
            status: "Pending"
        };

        try {
            const response = await axios.post(`http://localhost:7410/setgoals/save/${employee.id}/${selectedManager.id}`, dataToSend);
            message.success("Goal Shared !!!");

            const updatedGoals = goals.map(goal => {
                if (goal.id === goalId) {
                    return { ...goal, status: "pending" };
                }
                return goal;
            });
            setGoals(updatedGoals);

            // Clear selected manager details after sending
            setSelectedManagers(prevState => ({
                ...prevState,
                [goalId]: null,
            }));
        } catch (error) {
            message.warning("Please Select Manager before Sending");
            console.error('Error sending goal:', error);
        }

        const updatedData = {
            id: goalToSend.id,
            title: goalToSend.title,
            description: goalToSend.description,
            startdate: goalToSend.startdate,
            enddate: goalToSend.enddate,
            status: "PendingM"
        };

        axios.put(`http://localhost:7410/goals`, updatedData)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const navigate = useNavigate();
    const viewGoal = (id) => {
        navigate(`/employee-dash/viewdraft/${id}`);
    };

    return (
        <div className="goalsdiv">
            <div className="options">
                <h1>Draft Goals</h1>
                <Link to="/employee-dash/my-goals">
                    <button>View Submitted</button>
                </Link>
            </div>
            <div className="goals">
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <div className="error-message-container">
                        <p className="error-message">{error}</p>
                    </div>
                ) : (
                    <div className="goal-cards-container">
                        {goals.length > 0 ? (
                            goals.map(goal => (
                                <div key={goal.id} className={`goal-card ${goal.status}`}>
                                    <h3><b>Title: </b>{goal.title}</h3>
                                    <p><strong><b>Start Date: </b></strong> {goal.startdate}</p>
                                    <p><strong><b>End Date: </b></strong> {goal.enddate}</p>
                                    <div className="goal-actions">
                                        <select
                                            value={selectedManagers[goal.id] ? selectedManagers[goal.id].id : ''}
                                            onChange={(e) => handleManagerSelect(e, goal.id)}
                                            disabled={goal.status === "pendingm"}
                                        >
                                            <option value="">Select Manager</option>
                                            {managers.map(manager => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.firstname} {manager.lastname} - {manager.email}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleSendButtonClick(goal.id)}
                                            disabled={goal.status === "pending"}
                                        >
                                            Send
                                        </button>
                                    </div>

                                    <button onClick={() => viewGoal(goal.id)}>
                                        View Goal
                                    </button>
                                    {/* Display selected manager details if selected and not sent */}
                                    {selectedManagers[goal.id] && goal.status !== 'pending' && (
                                        <div className="selected-manager-details">
                                            <h4>Selected Manager Details:</h4>
                                            <p><strong>Name:</strong> {selectedManagers[goal.id].firstname} {selectedManagers[goal.id].lastname}</p>
                                            <p><strong>Email:</strong> {selectedManagers[goal.id].email}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No draft goals found for the employee.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraftGoals;
