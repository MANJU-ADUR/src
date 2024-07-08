import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Adminlogin.css';

const { Title } = Typography;

const Adminlogin = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [successMessage, setSuccessMessage] = useState('');

    const onFinish = (values) => {
        const { username, password } = values;
        if (username === 'sneha' && password === '99932100') {
            setSuccessMessage('Login successful! Redirecting...');
            message.success("Logined")
            setTimeout(() => {
                navigate('/admin');
            }, 1000); // Redirect to '/admin' after 1.5 seconds
        } else {
            form.setFields([
                { name: 'username', errors: ['Invalid username or password'] },
            ]);
        }
    };

    return (
        <div className="login-container">
            <Title level={2}>Admin Login</Title>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <Form
                form={form}
                name="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Adminlogin;
