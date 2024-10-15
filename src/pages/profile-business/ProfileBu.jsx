import React, { useState, useEffect } from 'react';
import { AptosClient } from "aptos";
import './ProfileBu.css';

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";

const ProfileBu = () => {
  const [profileData, setProfileData] = useState({
    walletAddress: '',
    name: '',
    totalStake: ''
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      if ("aptos" in window) {
        try {
          const aptosWallet = window.aptos;
          const response = await aptosWallet.connect();
          const walletAddress = response.address;

          const client = new AptosClient(NODE_URL);
          const businessStake = await fetchBusinessStake(client, walletAddress);
          
          setProfileData({
            walletAddress: walletAddress,
            name: getBusinessName(walletAddress),
            totalStake: `${businessStake.toFixed(4)} USDC`
          });
        } catch (error) {
          console.error('Error fetching business data:', error);
        }
      } else {
        console.error('Aptos wallet not found');
      }
    };

    fetchBusinessData();
  }, []);

  const fetchBusinessStake = async (client, address) => {
    try {
      const stake = await client.view({
        function: `${MODULE_ADDRESS}::investment_pool::business_stake`,
        type_arguments: [],
        arguments: [address]
      });
      return stake[0] / 1000000; // Convert to USDC
    } catch (error) {
      console.error('Error fetching business stake:', error);
      return 0;
    }
  };

  const getBusinessName = (address) => {
    // This is a placeholder. In a real application, you might want to fetch this from the blockchain or a separate database
    if (address === MODULE_ADDRESS) {
      return 'Fishing Business';
    } else if (address === '0x7e293800352a26008ff6aad253f3b585c711b0d429e592c4daff3dcc827c1f62') {
      return 'Agriculture Business';
    } else {
      return 'Unknown Business';
    }
  };

  return (
    <div className="profile-page">
      <h1>Business Profile</h1>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">Wallet Address:</span>
          <span className="profile-value">{profileData.walletAddress}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Business Name:</span>
          <span className="profile-value">{profileData.name}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Total Stake:</span>
          <span className="profile-value">{profileData.totalStake}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBu;