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
  const [hrs, setHrs] = useState([]);
  const [selectedHr, setSelectedHr] = useState({});
  const [managerFeedback, setManagerFeedback] = useState('');


  const dummymgr = JSON.parse(localStorage.getItem("User"))
  console.log(dummymgr);
  const email = dummymgr.email
  const password = dummymgr.password

  const [userdetails, setUserDetails] = useState(null)

  useEffect(() => {

    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(`http://localhost:7410/manager/find-by-email-password?email=${email}&password=${password}`);
        console.log('User details:', response.data.data);
        setUserDetails(response.data.data); // Assuming response.data contains user details
        localStorage.setItem("manager", JSON.stringify(response.data.data))
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };
    const fetchGoalAndEmployeeDetails = async () => {
      try {
        // Fetch goal details
        const goalResponse = await axios.get(`http://localhost:7410/setgoals/find/sentgoal/${id}`);
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
    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    const fetchHrs = async () => {
      try {
        const hrResponse = await axios.get('http://localhost:7410/hr/hrs');
        console.log('HRs response:', hrResponse.data);
        setHrs(hrResponse.data.data);
      } catch (error) {
        console.error('Error fetching HRs:', error);
        message.error('Failed to fetch HRs. Please try again later.');
      }
    };

    fetchHrs();
  }, []);

  const navigate = useNavigate()
  const handleNextButtonClick = async () => {
    try {
      if (!selectedHr) {
        message.warning('Please select an HR before proceeding.');
        return;
      }

      // Retrieve manager from localStorage
      const manager = JSON.parse(localStorage.getItem("User")) || {};
      console.log('Manager:', manager);

      // Extract HR ID from selectedHr
      const hrId = selectedHr;
      console.log(hrId);

      const dataToSend = {
        title: goal.title,
        description: goal.description,
        startdate: goal.startdate,
        enddate: goal.enddate,
        status: 'manager approved',
        goal_id: goal.id,
        manager_feedback: managerFeedback,
        manager_ratings: rating,
        mangerGoalid: goal.id,
      };
      console.log("data", dataToSend);
      // Send data to HR endpoint
      console.log(employee.id, userdetails.id, hrId);
      const hrGoalResponse = await axios.post(`http://localhost:7410/hrgoals/save/${employee.id}/${userdetails.id}/${hrId}`, dataToSend);
      console.log('HR goal saved:', hrGoalResponse.data);
      message.success('Goal forwarded to HR successfully!');
      navigate(`/manager-dash/employee-goals`)
    } catch (error) {
      console.error('Error forwarding goal to HR:', error);
      message.error('Failed to forward goal to HR. Please try again later.');
    }
    console.log(userdetails.id);
    const updatedata = {
      id: goal.goal_id,
      title: goal.title,
      description: goal.description,
      startdate: goal.startdate,
      enddate: goal.enddate,
      status: "managerA",
      manager_feedback: managerFeedback,
      manager_ratings: rating,
      manager_id: userdetails.id,
      hr_id: selectedHr 
    }
    axios.put(`http://localhost:7410/goals`, updatedata)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })

    const updatesentgaol = {
      id: goal.id,
      title: goal.title,
      goal_id: goal.goal_id,
      description: goal.description,
      startdate: goal.startdate,
      enddate: goal.enddate,
      status: "managerA",
      manager_feedback: managerFeedback,
      manager_ratings: rating,
    }
    axios.put(`http://localhost:7410/setgoals/update`, updatesentgaol)
      .then((res) => {
        console.log(res);
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
          {/* <p><strong>Status:</strong> {goal.status}</p> */}

          <h2>Employee Detail</h2>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Mobile Number:</strong> {employee.mobilenumber}</p>
          {/* <p><strong>Gender:</strong> {employee.gender}</p> */}
          <p><strong>Designation:</strong> {employee.designation}</p>

          <h2>Feedback</h2>
          <div className="feedback-section">
            <p>Rate this goal:</p>
            <Rate value={rating} onChange={value => setRating(value)} />


            <p>Manager Feedback:</p>
            <textarea
              value={managerFeedback}
              onChange={(e) => setManagerFeedback(e.target.value)}
              rows={4}
              style={{ width: '100%', marginBottom: '1rem' }}
              placeholder="Enter your feedback here..."
            />

            {/* Next button and HR selection */}
            <Select
              value={selectedHr}
              onChange={value => setSelectedHr(value)}
              style={{ width: '100%', marginTop: '1rem' }}
              placeholder="Select HR"
            >
              {hrs.map(hr => (
                <Option key={hr.id} value={hr.id}>{`${hr.firstname} ${hr.lastname}`} - <b>{hr.email}</b></Option>
              ))}
            </Select>
            <Button type="primary" onClick={handleNextButtonClick} style={{ marginTop: '1rem' }}>Next</Button>

          </div>
        </div>
      ) : (
        <p>No goal details for Now</p>
      )}
    </div>
  );
};

export default GoalDetail;
