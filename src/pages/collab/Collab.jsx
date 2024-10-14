import React from 'react';
import './Collab.css';
import { Link } from 'react-router-dom';

const Collab = () => {
  return (
    <div className="collabpage">
      <header className="collab-header">
        <h1 className="collab-text">Collab Now!</h1>
      </header>
      <div className="grid-container">
        <div className="grid-item">
          <h2>Fishing Business</h2>
          <button className="grid-button">Collaboration</button>
        </div>
        <div className="grid-item">
          <h2>Wheat Business</h2>
          <button className="grid-button">Collaboration</button>
        </div>
        <div className="grid-item">
          <h2>Crops Business</h2>
          <button className="grid-button">Collaboration</button>
        </div>
        <div className="grid-item">
          <h2>Plant Business</h2>
          <button className="grid-button">Collaboration</button>
        </div>
      </div>
    </div>
  );
};

export default Collab;
