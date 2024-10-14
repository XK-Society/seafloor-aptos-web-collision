import React, { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import './InvestNavbar.css';
import Logo from '../../assets/3d-logo.png';
import { Link } from 'react-router-dom';

const InvestNavbar = () => {
  const [account, setAccount] = useState(null);
  const [walletType, setWalletType] = useState(null);

  useEffect(() => {
    checkForConnectedWallet();
  }, []);

  const checkForConnectedWallet = async () => {
    if ('aptos' in window) {
      const wallet = window.aptos;
      try {
        const response = await wallet.account();
        if (response.address) {
          setAccount(response.address);
          setWalletType('petra');
        }
      } catch (error) {
        console.error('Failed to connect to Petra wallet:', error);
      }
    }
  };

  const connectPetraWallet = async () => {
    if ('aptos' in window) {
      const wallet = window.aptos;
      try {
        const response = await wallet.connect();
        setAccount(response.address);
        setWalletType('petra');
      } catch (error) {
        console.error('Failed to connect to Petra wallet:', error);
      }
    } else {
      window.open('https://petra.app/', '_blank');
    }
  };

  const disconnectWallet = async () => {
    if (walletType === 'petra' && 'aptos' in window) {
      const wallet = window.aptos;
      try {
        await wallet.disconnect();
      } catch (error) {
        console.error('Failed to disconnect from Petra wallet:', error);
      }
    }

    setAccount(null);
    setWalletType(null);
  };

  const switchWallet = async () => {
    // First, disconnect the current wallet
    await disconnectWallet();
    
    // Then, prompt to connect a new wallet
    await connectPetraWallet();
  };

  const formatAddress = (address) => {
    if (address && address.length > 10) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <nav className="navbar-investor">
      <div className="navbar-container-investor">
        <div className="logo-investor">
          <Link to='/'>
            <img src={Logo} alt="Logo" className="logo-image-investor" />
          </Link>
        </div>
        <div className="wallet-investor">
          {!account ? (
            <button className="wallet-button-investor" onClick={connectPetraWallet}>
              <FaWallet className="wallet-icon-investor" />
              <p>Connect<br/>Petra Wallet</p>
            </button>
          ) : (
            <div className="wallet-info-investor">
              <p>{`${formatAddress(account)} (${walletType})`}</p>
              <button onClick={disconnectWallet}>Disconnect</button>
              <button onClick={switchWallet}>Switch Wallet</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InvestNavbar;
