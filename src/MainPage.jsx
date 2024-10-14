import React from 'react';
import './App.css';
import seafloorLogo from './assets/3d-logo.png';

function MainPage({ openModal }) {
  return (
    <>
      <div className='container'>
        <div className='border-home'>
          <div className='logo-home'>
            <img src={seafloorLogo} className="logo" alt="Seafloor Finance logo" />
          </div>
          <h1>Welcome to<br/>Seafloor Finance!</h1>

          <div className="card">
            <button className="button" onClick={() => openModal('business')}>
              Business User
            </button>
            <br />
            <button className="button" onClick={() => openModal('investor')}>
              Investor
            </button>
          </div>
          <p>Raising funds is just one click away.</p>
        </div>
      </div>
    </>
  );
}

export default MainPage;
