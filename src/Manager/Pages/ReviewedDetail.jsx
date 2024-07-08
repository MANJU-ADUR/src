import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Rate } from 'antd'; // Import Rate component from Ant Design
import '../CSS/ReviewedDetail.css'; // Import your CSS file

const ReviewedDetail = () => {
    const [goal, setGoal] = useState(null);
    const param = useParams();

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const response = await axios.get(`http://localhost:7410/goals/${param.id}`);
                const { data } = response.data;
                console.log(response.data);
                setGoal(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching goal:', error);
                // Handle error state if needed
            }
        };

        fetchGoal();
    }, []);

    return (
        <div className="ReviewedDetail">
            <h2>Goal Details</h2>
            {goal ? (
                <div>
                    <h3><b>Title: </b> {goal.title}</h3>
                    <p><b>Description: </b>{goal.description}</p>
                    <p><b>My Ratings:</b>
                        <Rate disabled value={goal.manager_ratings} /> {/* Render Rate component with disabled and value props */}
                    </p>
                    <p><b>My Feedback:</b> {goal.manager_feedback}</p>
                    <p><b>Start Date:</b> {goal.startdate}</p>
                    <p><b>End Date:</b> {goal.enddate}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ReviewedDetail;
