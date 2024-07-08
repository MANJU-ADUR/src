import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import axios from 'axios';
import '../CSS/CreateGoal.css'; // Adjust the path based on your actual file location
import Login from '../../Landing_Components/Pages/Login';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CreateGoal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startdate, setStartDate] = useState(null);
    const [enddate, setEndDate] = useState(null);
    const [status, setStatus] = useState('Draft'); // Default status

    const employee = JSON.parse(localStorage.getItem("User"));
    console.log(employee.id);
    const email = employee.email
    const password = employee.password
    console.log(email, password);

    const navigate = useNavigate()
    const [real_emp, setreal_emp] = useState("")
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.post(`http://localhost:7410/employee/find-by-email-password?email=${email}&password=${password}`);
                console.log(response.data.data);
                setreal_emp(response.data.data);
                localStorage.setItem("employee", JSON.stringify(response.data.data))
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployee();
    }, []);

    console.log(real_emp.id);
    const handleSubmit = () => {
        if (title && description && startdate && enddate) {
            const goaldata = {
                title,
                description,
                startdate,
                enddate,
                status
            };

            axios.post(`http://localhost:7410/goals/save/${real_emp.id}`, goaldata)
                .then((res) => {
                    console.log(goaldata);
                    console.log(res.data);
                    message.success("Goal Created");
                    navigate(`/employee-dash/my-goals`)
                })
                .catch((err) => {
                    console.error(err);
                    message.error("Failed to create goal. Please try again.");
                });
        } else {
            message.error("Please fill in all fields.");
        }
    };


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleStartDateChange = (date, dateString) => {
        setStartDate(dateString);
    };

    const handleEndDateChange = (date, dateString) => {
        setEndDate(dateString);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <div className="creategoal">
            <Form
                layout="vertical"
                onFinish={handleSubmit}
            >
                <h2><u>Add Goal</u></h2>

                <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'Please enter the title' }]}
                >
                    <Input placeholder="Title" value={title} onChange={handleTitleChange} />
                </Form.Item>

                <Form.Item
                    name="description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <TextArea rows={4} placeholder="Description" value={description} onChange={handleDescriptionChange} />
                </Form.Item>

                <Form.Item
                    name="startdate"
                    rules={[{ required: true, message: 'Please select the start date' }]}
                >
                    <DatePicker style={{ width: '100%' }} placeholder="Start Date" value={startdate} onChange={handleStartDateChange} />
                </Form.Item>

                <Form.Item
                    name="enddate"
                    rules={[{ required: true, message: 'Please select the end date' }]}
                >
                    <DatePicker style={{ width: '100%' }} placeholder="End Date" value={enddate} onChange={handleEndDateChange} />
                </Form.Item>

                {/* Uncomment if status is needed */}
                {/* <Form.Item
                    name="status"
                    rules={[{ required: true, message: 'Please enter the status' }]}
                >
                    <Input placeholder="Status" value={status} onChange={handleStatusChange} />
                </Form.Item> */}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Goal
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateGoal;



