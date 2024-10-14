import React, { useState, useEffect } from 'react';
import { getHeaders } from '../../appUtils';
import './ProfileBu.css';

const ProfileBu = () => {
  const [profileData, setProfileData] = useState({
    walletAddress: '',
    name: '',
    amount: ''
  });

  useEffect(() => {
    // Fetch profile data from an API or local storage
    const fetchData = async () => {
      try {
        // First request: Get Wallet by address
        const walletResponse = await fetch(
          'https://service-testnet.maschain.com/api/wallet/wallet/0xFB033caae1eb318F1821204150A57fB7671c86Ba',
          {
            method: 'GET',
            headers: getHeaders(),
          }
        );

        const walletData = await walletResponse.json();
        const walletInfo = walletData.result;

        // Update profile data with wallet address and name
        setProfileData(prevState => ({
          ...prevState,
          walletAddress: walletInfo.address,
          name: walletInfo.name
        }));

        // Second request: Get Token Balance
        const balanceResponse = await fetch(
          'https://service-testnet.maschain.com/api/token/balance',
          {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              wallet_address: walletInfo.address,
              contract_address: '0xF5757012879C259A1c78f6eE6D60f1d13B42f4f5',
            }),
          }
        );

        const balanceData = await balanceResponse.json();

        // Update profile data with the amount
        setProfileData(prevState => ({
          ...prevState,
          amount: `${balanceData.result} SAND`
        }));
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    
    };

    fetchData();
  }, []);

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Wallet Address:</span>
          <span className="profile-value">{profileData.walletAddress}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Name:</span>
          <span className="profile-value">{profileData.name}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Amount:</span>
          <span className="profile-value">{profileData.amount}</span>
        </div>
        {/* <div className="profile-item">
          <span className="profile-label">Contract Address:</span>
          <span className="profile-value">{profileData.contractAddress}</span>
        </div> */}
      </div>
    </div>
  );
};

export default ProfileBu;
