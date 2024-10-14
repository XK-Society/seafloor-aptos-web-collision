import React from 'react';
import { Link } from 'react-router-dom';
import './ThankBusiness.css';

const ThankBusiness = () => {
  return (
    <div className="thank-you">
      <h1>Thank You!</h1>
      <p>Your business has been successfully registered.</p>
      <Link to="/collab" className="home-button">Back to Home</Link>
    </div>
  );
};

export default ThankBusiness;
