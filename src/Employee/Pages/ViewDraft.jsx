import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal } from 'antd'; // Import Modal component from Ant Design
import '../CSS/ViewDraft.css'; // Import your CSS file

const ViewDraft = () => {
    const [goal, setGoal] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
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
    }, [param.id]); // Add param.id to dependency array to fetch goal when id changes

    const handleDeleteGoal = async () => {
        try {
            await axios.delete(`http://localhost:7410/goals/${param.id}`);
            console.log('Goal deleted successfully');
            // Optionally, navigate to a different page or show a success message
        } catch (error) {
            console.error('Error deleting goal:', error);
            // Handle error state if needed
        } finally {
            setModalVisible(false); // Hide the modal after deletion attempt
        }
    };

    const handleOpenModal = () => {
        setModalVisible(true); // Function to open the modal
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Function to close the modal
    };

    return (
        <div className="ViewDraft">
            <h2>Goal Details</h2>
            {goal ? (
                <div>
                    <h3><b>Title: </b> {goal.title}</h3>
                    <p><b>Description: </b>{goal.description}</p>
                    <p><b>Start Date:</b> {goal.startdate}</p>
                    <p><b>End Date:</b> {goal.enddate}</p>
                    <button onClick={handleOpenModal}>Delete</button>
                    {/* Modal for Delete Confirmation */}
                    <Modal
                        title="Confirm Delete"
                        visible={modalVisible}
                        onOk={handleDeleteGoal}
                        onCancel={handleCloseModal}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <p>Are you sure you want to delete this goal?</p>
                    </Modal>
                </div>
            ) : (
                <p>Deleted...</p>
            )}
        </div>
    );
};

export default ViewDraft;
