import React from 'react';
import { Link } from 'react-router-dom';
import "../CSS/Landingpage.css"

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Welcome to the Performance Management System</h1>
                <p>
                    Streamline your performance goals, feedback, and evaluations with our integrated system.
                </p>
            </header>

            <section className="overview">
                <h2>How It Works</h2>
                <p>
                    Our Performance Management System empowers employees, managers, and HR professionals to collaborate effectively throughout the performance cycle:
                </p>
                <ul>
                    <li><strong>Employees:</strong> Set SMART goals and submit them to managers for review.</li>
                    <li><strong>Managers:</strong> Provide timely feedback and forward goals to HR for final approval.</li>
                    <li><strong>HR:</strong> Oversee the entire process, ensuring alignment with organizational objectives.</li>
                </ul>
            </section>

            <section className="roles">
                <h2>Roles and Responsibilities</h2>
                <div className="role">
                    <h3>Employee</h3>
                    <p>
                        As an employee, you play a crucial role in defining your objectives and tracking progress towards them. Use our system to set measurable goals that contribute to your professional growth and organizational success.
                    </p>
                </div>
                <div className="role">
                    <h3>Manager</h3>
                    <p>
                        Managers oversee the development and execution of team goals. They provide constructive feedback to employees, ensuring alignment with departmental and company-wide objectives. Managers also facilitate continuous improvement by evaluating performance and fostering employee development.
                    </p>
                </div>
                <div className="role">
                    <h3>HR</h3>
                    <p>
                        HR professionals manage the performance evaluation process to ensure fairness and consistency across the organization. They review goals and feedback provided by managers, offering insights and strategic guidance to optimize workforce performance. HR also uses data-driven insights to inform talent management decisions and support organizational growth.
                    </p>
                </div>
            </section>

            <section className="get-started">
                <h2>Get Started</h2>
                <p>
                    Ready to enhance your performance management process? Log in to begin setting goals, providing feedback, and driving performance excellence.
                </p>
                <Link to="/login" className="btn btn-primary">Login</Link>
            </section>

            <footer>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
