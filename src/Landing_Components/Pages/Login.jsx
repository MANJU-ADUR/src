import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Login.css'; // Adjust the path based on your actual file location

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const onFinish = async () => {
        try {
            const { email, password } = formData;
            if (email && password) {
                const response = await axios.post(`http://localhost:7410/register/find-by-email-password?email=${email}&password=${password}`);
                const { data } = response.data;

                if (data.designation === 'employee' || data.designation === 'manager' || data.designation === 'hr') {
                    localStorage.setItem('User', JSON.stringify(data));
                    console.log(response.data);
                    navigate(`/${data.designation}-dash`);
                    message.success('Login successful');
                } else {
                    message.error('Invalid email or password');
                }
            } else {
                message.error('Please enter credentials');
            }
        } catch (error) {
            console.log('Error during login:', error);
            message.error('Invalid Credentials');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="loginpage">
            <div className="login">
                <div className="form-container">
                    <h1>Performance Management System</h1>
                    <Form
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <label htmlFor="email">Email</label>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Invalid email format' },
                            ]}
                        >
                            <Input name="email" value={formData.email} onChange={handleInputChange} />
                        </Form.Item>

                        <label htmlFor="password">Password</label>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password name="password" value={formData.password} onChange={handleInputChange} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Log in
                            </Button>
                        </Form.Item>

                        <Link to="/register">New one? Register here</Link>
                    </Form>
                </div>

                <div className="admin-link">
                    <Link to="/adminlogin">
                        <Button><p>Admin ?</p></Button>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default Login;
