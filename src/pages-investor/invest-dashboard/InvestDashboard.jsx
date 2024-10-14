import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InvestDashboard.css'; // Import the CSS file
import DashImage from '../../assets/turtle.gif';

const InvestDashboard = () => {
    const tokens = [
        {
            id: 1,
            name: 'Token Name 1',
            description: 'Token Description 1',
            image: 'https://via.placeholder.com/100', // Replace with actual image URL
            totalInvest: '$1000',
        },
        {
            id: 2,
            name: 'Token Name 2',
            description: 'Token Description 2',
            image: 'https://via.placeholder.com/100', // Replace with actual image URL
            totalInvest: '$1500',
        },
        {
            id: 3,
            name: 'Token Name 3',
            description: 'Token Description 3',
            image: 'https://via.placeholder.com/100', // Replace with actual image URL
            totalInvest: '$3500',
        },
        // Add more tokens as needed
    ];

    return (
        <div className="dash-container">
            <h1 className="header">List of Tokenize</h1>
            <div className="token-list">
                {tokens.map(token => (
                    <div key={token.id} className="token-card">
                        <div className="gif-container-dash">
                            <img src={DashImage} alt="Default Tokenize image" className="token-image" />
                        </div>
                        <div className="token-info">
                            <h2 className="token-name">{token.name}</h2>
                            <p className="token-description">{token.description}</p>
                            <p className="token-invest">{token.totalInvest}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestDashboard;
