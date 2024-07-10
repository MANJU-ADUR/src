import React from 'react';
import { Link } from 'react-router-dom';
import "../CSS/Landingpage.css"

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Link to="/login" > <button>Click here to Proceed</button></Link>
        </div>
    );
}

export default LandingPage;
  