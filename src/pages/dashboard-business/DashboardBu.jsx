import React from'react';
import'./DashboardBu.css';
import { FaArrowRight } from 'react-icons/fa';
import TokenList from '../home-business/BuToken/TokenList';

const DashboardBu = () => {
  return (
    <div className="dashboard">
      <h1 className='dashboard-title'>Dashboard</h1>
      <TokenList />
      </div>
  );
};

export default DashboardBu;
