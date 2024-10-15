import React, { useState, useEffect } from 'react';
import { AptosClient } from "aptos";
import './ProfileBu.css';

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";

const ProfileBu = () => {
  const [profileData, setProfileData] = useState({
    walletAddress: '',
    name: '',
    totalStake: '',
    totalProfit: '',
    lastProfitDistribution: ''
  });
  const [profitAmount, setProfitAmount] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if ("aptos" in window) {
        try {
          const aptosWallet = window.aptos;
          const response = await aptosWallet.connect();
          const walletAddress = response.address;

          const newClient = new AptosClient(NODE_URL);
          setClient(newClient);

          const businessStake = await fetchBusinessStake(newClient, walletAddress);
          const totalProfit = await fetchTotalProfit(newClient);
          const lastProfitDistribution = await fetchLastProfitDistribution(newClient);
          
          setProfileData({
            walletAddress: walletAddress,
            name: getBusinessName(walletAddress),
            totalStake: `${businessStake.toFixed(4)} USDC`,
            totalProfit: `${totalProfit.toFixed(4)} USDC`,
            lastProfitDistribution: new Date(lastProfitDistribution * 1000).toLocaleString()
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

  const fetchTotalProfit = async (client) => {
    try {
      const profit = await client.view({
        function: `${MODULE_ADDRESS}::investment_pool::total_profit`,
        type_arguments: [],
        arguments: []
      });
      return profit[0] / 1000000; // Convert to USDC
    } catch (error) {
      console.error('Error fetching total profit:', error);
      return 0;
    }
  };

  const fetchLastProfitDistribution = async (client) => {
    try {
      const lastDistribution = await client.view({
        function: `${MODULE_ADDRESS}::investment_pool::last_profit_distribution`,
        type_arguments: [],
        arguments: []
      });
      return lastDistribution[0];
    } catch (error) {
      console.error('Error fetching last profit distribution:', error);
      return 0;
    }
  };

  const getBusinessName = (address) => {
    if (address === MODULE_ADDRESS) {
      return 'Fishing Business';
    } else if (address === '0x7e293800352a26008ff6aad253f3b585c711b0d429e592c4daff3dcc827c1f62') {
      return 'Agriculture Business';
    } else {
      return 'Unknown Business';
    }
  };

  const handleDistributeProfit = async () => {
    if (!client || !profileData.walletAddress || !profitAmount) return;

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::investment_pool::distribute_profits`,
        type_arguments: [],
        arguments: [Math.floor(parseFloat(profitAmount) * 1000000).toString()] // Convert to smallest unit
      };

      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(pendingTransaction.hash);

      // Refresh data after distribution
      const totalProfit = await fetchTotalProfit(client);
      const lastProfitDistribution = await fetchLastProfitDistribution(client);

      setProfileData(prevState => ({
        ...prevState,
        totalProfit: `${totalProfit.toFixed(4)} USDC`,
        lastProfitDistribution: new Date(lastProfitDistribution * 1000).toLocaleString()
      }));

      setProfitAmount('');
      console.log("Profit distributed successfully");
    } catch (error) {
      console.error("Failed to distribute profit:", error);
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
        <div className="profile-item">
          <span className="profile-label">Total Profit:</span>
          <span className="profile-value">{profileData.totalProfit}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Last Profit Distribution:</span>
          <span className="profile-value">{profileData.lastProfitDistribution}</span>
        </div>
      </div>
      <div className="profit-distribution">
        <h2>Distribute Profit</h2>
        <input
          type="number"
          value={profitAmount}
          onChange={(e) => setProfitAmount(e.target.value)}
          placeholder="Enter profit amount in USDC"
        />
        <button onClick={handleDistributeProfit}>Distribute Profit</button>
      </div>
    </div>
  );
};

export default ProfileBu;