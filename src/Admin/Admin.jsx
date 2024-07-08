import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Import your CSS file for styling
import { Link } from 'react-router-dom';

const Admin = () => {
    const [members, setMembers] = useState([]);
    const [sortedMembers, setSortedMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://localhost:7410/register/all-members');
                if (response.data.statuscode === 200) {
                    setMembers(response.data.data);
                    // Filter members by HR initially
                    const hrMembers = response.data.data.filter(member => member.designation.toLowerCase() === 'hr');
                    setSortedMembers(hrMembers);
                    setLoading(false);
                } else {
                    console.error('Error fetching members:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    const handleSortMembers = (designation) => {
        const filteredMembers = members.filter(member => member.designation.toLowerCase() === designation.toLowerCase());
        setSortedMembers(filteredMembers);
    };
    return (
        <div className="admin-container">
            <div className="admin-header">
                <Link to="/" >
                    <button className="logout-button">Logout</button>
                </Link>
            </div>

            <div className="admin-buttons">
                <button onClick={() => handleSortMembers("hr")}>Company HR's</button>
                <button onClick={() => handleSortMembers("manager")}>Company Manager's</button>
                <button onClick={() => handleSortMembers("employee")}>Company Employee's</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : sortedMembers.length > 0 ? (
                <div className="member-table">
                    {/* <h2>Sorted Members</h2> */}
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                {/* Add more columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMembers.map(member => (
                                <tr key={member.id}>
                                    <td>{`${member.firstname} ${member.lastname}`}</td>
                                    <td>{member.gender}</td>
                                    <td>{member.email}</td>
                                    <td>{member.mobilenumber}</td>
                                    {/* Render additional fields */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No members found for selected designation.</p>
            )}
        </div>
    );
};

export default Admin;
