// // ViewGoal.jsx

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Rate, Modal, Progress, Spin } from 'antd';
// import '../CSS/ViewGoal.css'; // Adjust the path based on your actual CSS file location

// const ViewGoal = () => {
//     const { id } = useParams(); // Accessing the 'id' parameter from the URL path
//     const [goal, setGoal] = useState(null); // State to store the goal data
//     const [feedbackModalVisible, setFeedbackModalVisible] = useState(false); // State for feedback modal visibility
//     const [selectedFeedback, setSelectedFeedback] = useState({}); // State to store selected feedback details
//     const [loading, setLoading] = useState(true); // Loading state

//     useEffect(() => {
//         const fetchGoal = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:7410/goals/${id}`);
//                 console.log('Goal details:', response.data);
//                 if (response.data.statuscode === 200) {
//                     setGoal(response.data.data); // Set the goal data in state
//                 } else {
//                     console.error('Error fetching goal:', response.data.message);
//                 }
//             } catch (error) {
//                 console.error('Error fetching goal:', error);
//             } finally {
//                 setLoading(false); // Set loading to false regardless of success or failure
//             }
//         };

//         fetchGoal(); // Fetch goal data when the component mounts or when the 'id' parameter changes
//     }, [id]); // Include 'id' in dependency array to refetch when 'id' changes

//     const handleDotClick = (status) => {
//         if (status === 'managera' || status === 'hra') {
//             // Display modal with manager or HR feedback and ratings
//             setSelectedFeedback({
//                 feedback: status === 'managera' ? goal.manager_feedback : goal.hr_feedback,
//                 ratings: status === 'managera' ? goal.manager_ratings : goal.hr_ratings,
//                 type: status // Store the type of feedback for conditional rendering
//             });
//             setFeedbackModalVisible(true);
//         }
//         // No action needed for 'pendingm' status
//     };

//     const getStatusPercentage = () => {
//         if (!goal) return 0;

//         switch (goal.status) {
//             case 'PendingM':
//                 return 33.3; // Adjust as needed
//             case 'managerA':
//                 return 66.6; // Adjust as needed
//             case 'HrA':
//                 return 100; // Adjust as needed
//             case 'rejected':
//                 return 0; // No progress for rejected status
//             default:
//                 return 0;
//         }
//     };

//     const getStatusColor = (status) => {
//         if (status === goal.status) {
//             switch (status) {
//                 case 'PendingM':
//                     return 'blue'; // Blue for pendingm
//                 case 'managerA':
//                     return 'yellow'; // Blue for managera
//                 case 'HrA':
//                     return 'green'; // Blue for hra
//                 case 'rejected':
//                     return 'red'; // Red for rejected
//                 default:
//                     return '#999'; // Default color
//             }
//         }
//         return '#999'; // Default color
//     };

//     const getStatusLabel = () => {
//         if (!goal) return '';

//         switch (goal.status) {
//             case 'PendingM':
//                 return 'In Progress'; // Label for pendingM status
//             case 'managerA':
//                 return 'Reviewed by Manager'; // Label for managerA status
//             case 'HrA':
//                 return 'Reviewed by HR'; // Label for hrA status
//             case 'rejected':
//                 return 'Rejected'; // Label for rejected status
//             default:
//                 return ''; // Default label
//         }
//     };


//     return (
//         <div>
//             <br /><br />
//             <div className="viewgoal">
//                 {loading ? (
//                     <Spin size="large" />
//                 ) : goal ? (
//                     <div>
//                         <h1>{goal.title}</h1>
//                         <p><strong>Description:</strong> {goal.description}</p>
//                         <p><strong>Start Date:</strong> {goal.startdate}</p>
//                         <p><strong>End Date:</strong> {goal.enddate}</p>
//                         <p><strong>Status:</strong> {getStatusLabel(goal.status)}</p>

//                         {/* Status Bar */}
//                         <div className="status-bar">
//                             <Progress percent={getStatusPercentage()} showInfo={false} strokeColor={getStatusColor(goal.status)} />
//                         </div>

//                         {/* Status Line with Dots */}
//                         <div className="status-line">
//                             <span className={`dot ${goal.status === 'pendingm' ? 'active' : ''} ${goal.status === 'rejected' ? 'rejected' : ''}`} onClick={() => handleDotClick('pendingm')}></span>
//                             <span className={`dot ${goal.status === 'managera' ? 'active' : ''} ${goal.status === 'rejected' ? 'rejected' : ''}`} onClick={() => handleDotClick('managera')}></span>
//                             <span className={`dot ${goal.status === 'hra' ? 'active' : ''} ${goal.status === 'rejected' ? 'rejected' : ''}`} onClick={() => handleDotClick('hra')}></span>
//                         </div>

//                         {/* Modal for Feedback and Ratings */}
//                         <Modal
//                             title="Feedback and Ratings"
//                             visible={feedbackModalVisible}
//                             onCancel={() => setFeedbackModalVisible(false)}
//                             footer={null}
//                         >
//                             <p><strong>Feedback:</strong> {selectedFeedback.feedback}</p>
//                             <p><strong>Ratings:</strong> {selectedFeedback.ratings}</p>
//                             <Rate disabled defaultValue={selectedFeedback.ratings} />
//                         </Modal>
//                     </div>
//                 ) : (
//                     <p>Error: Failed to load goal details.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ViewGoal;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Rate, Modal, Progress, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import '../CSS/ViewGoal.css'; // Adjust the path based on your actual CSS file location

const ViewGoal = () => {
    const { id } = useParams();
    const [goal, setGoal] = useState(null);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState({});
    const [loading, setLoading] = useState(true);
    const [managerDetails, setManagerDetails] = useState(null); // State for manager details
    const [hrDetails, setHrDetails] = useState(null); // State for HR details

    useEffect(() => {
        const fetchGoalAndDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:7410/goals/${id}`);
                console.log('Goal details:', response.data);
                if (response.data.statuscode === 200) {
                    const fetchedGoal = response.data.data;
                    setGoal(fetchedGoal);

                    // Fetch manager details
                    const managerResponse = await axios.get(`http://localhost:7410/manager/${fetchedGoal.manager_id}`);
                    console.log('Manager details:', managerResponse.data);
                    setManagerDetails(managerResponse.data.data);

                    // Fetch HR details
                    const hrResponse = await axios.get(`http://localhost:7410/hr/hr-by-id/${fetchedGoal.hr_id}`);
                    console.log('HR details:', hrResponse.data);
                    setHrDetails(hrResponse.data.data);
                } else {
                    console.error('Error fetching goal:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching goal:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoalAndDetails();
    }, [id]);

    const handleDotClick = (status) => {
        if (status === 'managera' || status === 'hra') {
            setSelectedFeedback({
                feedback: status === 'managera' ? goal.manager_feedback : goal.hr_feedback,
                ratings: status === 'managera' ? goal.manager_ratings : goal.hr_ratings,
                type: status
            });
            setFeedbackModalVisible(true);
        }
    };

    const getStatusPercentage = () => {
        if (!goal) return 0;

        switch (goal.status) {
            case 'PendingM':
                return 33.3;
            case 'managerA':
                return 66.6;
            case 'HrA':
                return 100;
            case 'rejected':
                return 0;
            default:
                return 0;
        }
    };

    const getStatusColor = (status) => {
        if (status === goal.status) {
            switch (status) {
                case 'PendingM':
                    return 'blue';
                case 'managerA':
                    return 'yellow';
                case 'HrA':
                    return 'green';
                case 'rejected':
                    return 'red';
                default:
                    return '#999';
            }
        }
        return '#999';
    };

    const getStatusLabel = () => {
        if (!goal) return '';

        switch (goal.status) {
            case 'PendingM':
                return 'In Progress';
            case 'managerA':
                return 'Reviewed by Manager';
            case 'HrA':
                return 'Reviewed by HR';
            case 'rejected':
                return 'Rejected';
            default:
                return '';
        }
    };

    return (
        <div>
            <br /><br />
            <div className="viewgoal">
                {loading ? (
                    <Spin size="large" />
                ) : goal ? (
                    <div>
                        <h1>{goal.title}</h1>
                        <p><strong>Description:</strong> {goal.description}</p>
                        <p><strong>Start Date:</strong> {goal.startdate}</p>
                        <p><strong>End Date:</strong> {goal.enddate}</p>
                        <p><strong>Status:</strong> {getStatusLabel(goal.status)}</p>

                        <div className="status-bar">
                            <Progress percent={getStatusPercentage()} showInfo={false} strokeColor={getStatusColor(goal.status)} />
                        </div>

                        <div className="status-line">
                            <span className={`dot ${goal.status === 'pendingm' ? 'active' : ''} ${goal.status === 'rejected' ? 'rejected' : ''}`} onClick={() => handleDotClick('pendingm')}></span>
                            <span className={`dot ${goal.status === 'managera' ? 'active' : ''} ${goal.status === 'rejected' ? 'rejected' : ''}`} onClick={() => handleDotClick('managera')}></span>
                            <span className={`dot ${goal.status === 'hra' ? 'active' : ''} ${goal.status === 'rejected' ? 'rejected' : ''}`} onClick={() => handleDotClick('hra')}></span>
                        </div>

                        <Modal
                            title="Feedback and Ratings"
                            visible={feedbackModalVisible}
                            onCancel={() => setFeedbackModalVisible(false)}
                            footer={null}
                        >
                            <p><strong>Feedback:</strong> {selectedFeedback.feedback}</p>
                            <p><strong>Ratings:</strong> {selectedFeedback.ratings}</p>
                            <Rate disabled defaultValue={selectedFeedback.ratings} />
                        </Modal>

                        {/* Display Manager Details */}
                        {managerDetails && (
                            <div className="manager-details">
                                <h3>Manager Details:</h3>
                                <p><strong>Name:</strong> {managerDetails.firstname} {managerDetails.lastname}</p>
                                <p><strong>Email:</strong> {managerDetails.email}</p>
                            </div>
                        )}

                        {/* Display HR Details */}
                        {
                            goal.hr_feedback && (
                                <div className="hrdetalis">
                                    {hrDetails && (
                                        <div className="hr-details">
                                            <h3>HR Details:</h3>
                                            <p><strong>Name:</strong> {hrDetails.firstname} {hrDetails.lastname}</p>
                                            <p><strong>Email:</strong> {hrDetails.email}</p>
                                        </div>
                                    )}
                                </div>

                            )
                        }

                    </div>
                ) : (
                    <p>Error: Failed to load goal details.</p>
                )}
            </div>
        </div>
    );
};

export default ViewGoal;

