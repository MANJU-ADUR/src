import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { json, useNavigate, useParams } from 'react-router-dom';
import { Rate, Button, message, Select } from 'antd'; // Importing Ant Design components
import "../CSS/GoalDetail.css";

const { Option } = Select;

const GoalDetail = () => {
    const { id } = useParams(); // Get the goal ID from URL params
    const [goal, setGoal] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0); // State to store the selected rating
    const [hr_feedback, sethr_feedback] = useState('');


    const hr = JSON.parse(localStorage.getItem("Hr"))
    console.log(hr);

    const [userdetails, setUserDetails] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchGoalAndEmployeeDetails = async () => {
            try {
                // Fetch goal details
                const goalResponse = await axios.get(`http://localhost:7410/goals/${id}`);
                console.log('Goal detail response:', goalResponse.data);
                setGoal(goalResponse.data.data);

                // Fetch employee details associated with the goal
                const employeeResponse = await axios.get(`http://localhost:7410/goals/find-emp/${id}`);
                console.log('Employee detail response:', employeeResponse.data);
                setEmployee(employeeResponse.data.data);

                setLoading(false);
                setError(null);
            } catch (error) {
                console.error('Error fetching goal and employee details:', error);
                setError('Failed to fetch goal and employee details.');
                setLoading(false);
            }
        };

        fetchGoalAndEmployeeDetails();
    }, [id]);


    const handleNextButtonClick = () => {
        const updatedata1 = {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            startdate: goal.startdate,
            enddate: goal.enddate,
            status: "HrA",
            manager_feedback: goal.manager_feedback,
            manager_ratings: goal.manager_ratings,
            hr_feedback: hr_feedback,
            hr_ratings: rating,
            hr_id: hr.id,
            manager_id: goal.manager_id
        }
        console.log(goal.manager_id);
        console.log(updatedata1);
        axios.put(`http://localhost:7410/goals`, updatedata1)
            .then((res) => {
                console.log(res);
                // message.success("done")
                navigate(`/hr-dash/goals`)

            })
            .catch((err) => {
                console.log(err);
            })

        const updatedata2 = {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            startdate: goal.startdate,
            enddate: goal.enddate,
            status: "HrA",
            manager_feedback: goal.manager_feedback,
            manager_ratings: goal.manager_ratings,
            hr_feedback: hr_feedback,
            hr_ratings: rating,


        }
        axios.put(`http://localhost:7410/setgoals/update`, updatedata2)
            .then((res) => {
                console.log(res);
                message.success("Review Sent Successfully!!")
            })
            .catch((err) => {
                console.log(err);
            })


    };

    return (
        <div className="goal-detail-container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : goal && employee ? (
                <div className="goal-details">
                    <h2>Goal Detail</h2>
                    <p>This goal was prepared by <b>{employee.firstname} {employee.lastname}</b></p>
                    <p><strong>Title:</strong> {goal.title}</p>
                    <p><strong>Description:</strong> {goal.description}</p>
                    <p><strong>Start Date:</strong> {goal.startdate}</p>
                    <p><strong>End Date:</strong> {goal.enddate}</p>

                    <h2>Employee Detail</h2>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Mobile Number:</strong> {employee.mobilenumber}</p>
                    {/* <p><strong>Gender:</strong> {employee.gender}</p> */}
                    <p><strong>Designation:</strong> {employee.designation}</p>

                    <h2>Feedback</h2>
                    <div className="feedback-section">
                        <p>Rate this goal:</p>
                        <Rate value={rating} onChange={value => setRating(value)} />


                        <p>HR Feedback:</p>
                        <textarea
                            value={hr_feedback}
                            onChange={(e) => sethr_feedback(e.target.value)}
                            rows={4}
                            style={{ width: '100%', marginBottom: '1rem' }}
                            placeholder="Enter your feedback here..."
                        />


                        <Button type="primary" onClick={handleNextButtonClick} style={{ marginTop: '1rem' }}>Done</Button>

                    </div>
                </div>
            ) : (
                <p>No goal details found for ID: {id}</p>
            )}
        </div>
    );
};

export default GoalDetail;
