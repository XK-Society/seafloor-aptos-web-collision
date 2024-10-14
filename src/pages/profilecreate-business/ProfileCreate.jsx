import React, { useState } from 'react';
import { FaArrowRight } from'react-icons/fa';
import'./ProfileCreate.css';
import { Link } from 'react-router-dom';

const ProfileCreate = () => {
  return (
    <div className="profile-create">
      <h1 className='title-profile'>Create Profile</h1>
        <section className="business-info">
          <h2 className='text-profile'>Business Information</h2>
          <p className='text-p'>Business Name</p>
              <input type="text" placeholder="Business-1"/>
            <p className='text-p'>Business Email</p>
              <input type="text" placeholder="businesstest@gmail.com"/>
            <p className='text-p'>User IC</p>
              <input type="text" placeholder="123456789"/>
            {/* <p className='text-p'>Wallet Name</p>
              <input type="text" placeholder="Wallet Name"/> */}
            <p className='text-p'>Phone</p>
              <input type="text" placeholder="0192746582"/> 
        </section>
        <Link to='/thankbu'>
          <button className="save-button-profile">Save</button>
        </Link>
        </div>
  );
};

export default ProfileCreate;
