import React from'react';
import'./Choose.css';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Choose = () => {
  return (
    <div className="choose">
      <h1 className='choose-title'>Choose your network base on your requirement:</h1>
      <div className="grid-container">
        <div className="grid-item">
          <h2>Maschain</h2>
          <p className="choose-description">
            Small funds and immediate
          </p>
          <Link to='/profilecreate'>
            <button className="arrow-button"><FaArrowRight /></button>
          </Link>
        </div>
        <div className="grid-item">
          <h2>Aptos</h2>
          <p className="choose-description">
            Medium funds and immediate
          </p>
          <button className="arrow-button"><FaArrowRight /></button>
        </div>
        <div className="grid-item">
          <h2>Ethereum</h2>
          <p className="choose-description">
            Large funds and longer
          </p>
          <button className="arrow-button"><FaArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default Choose;
