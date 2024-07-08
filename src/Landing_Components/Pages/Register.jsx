import React, { useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Register.css"
import { Option } from 'antd/es/mentions';
import axios from 'axios';

const Register = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [designation, setDesignation] = useState("");
    const [mobilenumber, setMobilenumber] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate()
    const onFinish = (values) => {
        if (firstname && lastname && gender && password && mobilenumber && email) {
            const data = { firstname, lastname, gender, password, mobilenumber, email, designation }
            axios.post(`http://localhost:7410/register/save`, data)
                .then((res) => {
                    console.log("designation=> ", designation);
                    axios.post(`http://localhost:7410/${designation}/save`, data)
                        .then((res) => {
                            message.success("Resistration Succesfull please login to continue")
                            navigate("/")
                        })
                        .catch((err) => {
                            message.err(`${designation} already Exists`)
                        })
                })
                .catch((err) => {
                    message.error(`Email/mobile already Exists`)
                    console.log(err);
                })
        } else {
            message.error('Please fill in all required fields');
        }
    };

    const handleGenderChange = (value) => {
        setGender(value);
    };

    const handleDesignationChange = (value) => {
        setDesignation(value);
    };
    return (
        <div className="register">
            <div className="form-container">
                <Form
                    name="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <label htmlFor="">Firstname</label>
                    <Form.Item
                        name="Firstname"
                        rules={[{ required: true, message: 'Please enter your Firstname!' }]}
                    >
                        <Input value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    </Form.Item>
                    <label htmlFor="">
                        lastname
                    </label>
                    <Form.Item
                        name="Lastname"
                        rules={[{ required: true, message: 'Please enter your Lastname!' }]}
                    >
                        <Input value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </Form.Item>
                    <label htmlFor="">Gender</label>
                    <Form.Item
                        name="gender"
                        rules={[{ required: true, message: 'Please select your gender!' }]}
                    >
                        <Select value={gender} onChange={handleGenderChange} placeholder="Select gender">
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <label htmlFor="">Password</label>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>
                    <label htmlFor="">Designation</label>
                    <Form.Item
                        name="designation"
                        rules={[{ required: true, message: 'Please select your designation!' }]}
                    >
                        <Select value={designation} onChange={handleDesignationChange} placeholder="Select designation">
                            <Option value="hr">HR</Option>
                            <Option value="manager">Manager</Option>
                            <Option value="employee">Employee</Option>
                        </Select>
                    </Form.Item>
                    <label htmlFor="">Mobile Number</label>
                    <Form.Item
                        name="mobilenumber"
                        rules={[
                            { required: true, message: 'Please enter your mobile number!' },
                            { pattern: /^\d{10}$/, message: 'Mobile number must be 10 digits' }
                        ]}
                    >
                        <Input value={mobilenumber} onChange={(e) => setMobilenumber(e.target.value)} />
                    </Form.Item>
                    <label htmlFor="">Email</label>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Invalid email format' }
                        ]}
                    >
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <Link to="/">
                    Already have an account? Log in
                </Link>
            </div>
        </div>
    );
};

export default Register;
