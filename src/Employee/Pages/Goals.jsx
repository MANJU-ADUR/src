import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import axios from 'axios';
import '../CSS/Goals.css'; // Ensure the correct path to your CSS file
import { Link, useNavigate } from 'react-router-dom';

const Goals = () => {
    // Initialize states for goals, loading, error, managers, and selected managers per goal
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [managers, setManagers] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState({}); // State to store selected managers for each goal

    useEffect(() => {
        // Fetch employee data from localStorage
        const employee = JSON.parse(localStorage.getItem('employee'));

        // Fetch managers data function
        const fetchManagers = async () => {
            try {
                const response = await axios.get(`http://localhost:7410/manager/managers`);
                console.log(response.data);
                setManagers(response.data.data); // Assuming managers data is in response.data.data
            } catch (error) {
                console.error('Error fetching managers:', error);
                setError('Failed to fetch managers.');
            }
        };

        // Fetch goals data based on employee id
        const fetchGoals = async (employeeId) => {
            try {
                const response = await axios.get(`http://localhost:7410/goals/goals-by-employee/${employeeId}`);
                console.log(response.data);

                if (response.data.statuscode === 200) {
                    const normalizedGoals = response.data.data.map(goal => ({
                        ...goal,
                        status: goal.status.trim().toLowerCase()
                    }));

                    // Filter out goals with status "Draft"
                    const filteredGoals = normalizedGoals.filter(goal => goal.status !== 'draft');

                    // Initialize selectedManagers state object with empty values for each goal
                    const initialSelectedManagers = filteredGoals.reduce((acc, goal) => {
                        acc[goal.id] = null;
                        return acc;
                    }, {});
                    setSelectedManagers(initialSelectedManagers);

                    setGoals(filteredGoals);
                    if (filteredGoals.length === 0) {
                        setError("No goals set by the employee.");
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

        // Ensure employee and employee.id exist before fetching goals
        if (employee && employee.id) {
            fetchManagers(); // Fetch managers only once on component mount
            fetchGoals(employee.id); // Fetch goals based on employee id
        } else {
            setLoading(false); // Set loading to false if employee data is not available
        }
    }, []); // Empty dependency array ensures this runs only once on component mount

    const handleManagerSelect = (event, goalId) => {
        const selectedId = parseInt(event.target.value, 10); // Ensure to parse the ID as an integer
        const selectedManagerData = managers.find(manager => manager.id === selectedId);

        setSelectedManagers(prevState => ({
            ...prevState,
            [goalId]: selectedManagerData,
        }));
    };

    const handleSendButtonClick = async (goalId) => {
        const selectedManager = selectedManagers[goalId];
        console.log(`Sending data for goal ${goalId}:`, selectedManager);

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
            console.log('Goal sent successfully:', response.data);
            message.success("Goal Shared !!!")
            // Handle success response as needed

            // Update local state to mark the goal as sent
            const updatedGoals = goals.map(goal => {
                if (goal.id === goalId) {
                    return { ...goal, status: "pending" };
                }
                return goal;
            });
            setGoals(updatedGoals);
        } catch (error) {
            message.warning("Please Select Manger before Sneding")
            console.error('Error sending goal:', error);
            // Handle error response as needed
        }

        const updatedata = {
            id: goalToSend.id,
            title: goalToSend.title,
            description: goalToSend.description,
            startdate: goalToSend.startdate,
            enddate: goalToSend.enddate,
            status: "PendingM"
        }
        axios.put(`http://localhost:7410/goals`, updatedata)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    };
    const navigate = useNavigate()
    const viewgoal = (id) => {
        navigate(`/employee-dash/view/${id}`)
    }
    return (
        <div className="goalsdiv">
            <div className="options">
                <h1>Submitted Goals</h1>
                <Link to="/employee-dash/drafts"> <button>View Draft</button></Link>
            </div>
            <div className="goals">
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <div className="error-message-container">
                        <p className="error-message">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="goal-cards-container">
                            {goals.length > 0 ? (
                                goals.map(goal => (
                                    <div key={goal.id} className={`goal-card ${goal.status}`}>
                                        <h3>Title:{goal.title}</h3>
                                        {/* <h3>{goal.description}</h3> */}
                                        <p><strong>Start Date:</strong> {goal.startdate}</p>
                                        <p><strong>End Date:</strong> {goal.enddate}</p>
                                        {/* <p><strong>Status:</strong> {goal.status}</p> */}
                                        {/* <div className="goal-actions">
                                            <select
                                                value={selectedManagers[goal.id] ? selectedManagers[goal.id].id : ''}
                                                onChange={(e) => handleManagerSelect(e, goal.id)}
                                                disabled={goal.status === "pendingm"} // Disable if already sent
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
                                                disabled={goal.status === "pending"} // Disable if already sent
                                            >
                                                Send
                                            </button>
                                        </div> */}


                                        <button onClick={() => { viewgoal(goal.id) }} >
                                            View Goal
                                        </button>
                                        {selectedManagers[goal.id] && (
                                            <div className="selected-manager-details">
                                                <h4>Selected Manager Details:</h4>
                                                <p><strong>Name:</strong> {selectedManagers[goal.id].firstname} {selectedManagers[goal.id].lastname}</p>
                                                <p><strong>Email:</strong> {selectedManagers[goal.id].email}</p>
                                                {/* Add more details as needed */}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No goals found for the employee.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Goals;
