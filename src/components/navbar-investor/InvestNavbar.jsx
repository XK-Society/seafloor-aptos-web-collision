import React, { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import './InvestNavbar.css';
import Logo from '../../assets/3d-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useKeylessAccounts } from '../core/useKeylessAccounts'; // For Google Login
import useEphemeralKeyPair from '../core/useEphemeralKeyPair'; // Google ephemeral key
import { GOOGLE_CLIENT_ID } from '../core/constants'; // Replace with your own client ID

const InvestNavbar = () => {
  const [account, setAccount] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [userName, setUserName] = useState(null);
  const [humanReadableAddress, setHumanReadableAddress] = useState(null);

  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const navigate = useNavigate();
  const ephemeralKeyPair = useEphemeralKeyPair();

  const toHumanReadableAddress = (byteArray) => {
    if (!Array.isArray(byteArray) && !(byteArray instanceof Uint8Array)) {
      throw new Error('Invalid input: Expected a Uint8Array or an array of numbers.');
    }
  
    return Array.from(byteArray)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };
  
  const getAddressData = (accountData) => {
    if (!accountData) {
      console.error('Account data is null or undefined');
      return null;
    }
    if (accountData.accountAddress && accountData.accountAddress.data instanceof Uint8Array) {
      return accountData.accountAddress.data;
    }
    console.error('Invalid account data structure:', accountData);
    return null;
  };

  const updateHumanReadableAddress = (accountData) => {
    if (!accountData) return;

    try {
      const addressData = getAddressData(accountData);
      if (addressData) {
        const readableAddress = toHumanReadableAddress(addressData);
        setHumanReadableAddress(readableAddress);
        console.log(`Full Address: ${readableAddress}`);
      }
    } catch (error) {
      console.error('Error converting address:', error);
    }
  };

  useEffect(() => {
    if (activeAccount) {
      setAccount(activeAccount);
      setWalletType('google');
      setUserName(activeAccount.email || activeAccount.uidVal); // Use email if available, otherwise use uidVal
      updateHumanReadableAddress(activeAccount);
    } else {
      checkForConnectedWallet();
    }
  }, [activeAccount]);

  // -------------- PETRA WALLET LOGIC --------------
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
    setUserName(null);
  };

  const switchWallet = async () => {
    await disconnectWallet();
    await connectPetraWallet();
  };

  const formatAddress = (address) => {
    if (address && address.length > 10) {
      return `0x${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  // -------------- GOOGLE LOGIN LOGIC --------------
  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  const searchParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID, // Replace with your actual Google Client ID
    redirect_uri: `${window.location.origin}/callback`,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: ephemeralKeyPair.nonce,
  });

  redirectUrl.search = searchParams.toString();

  const handleGoogleLogin = () => {
    window.location.href = redirectUrl.toString(); // Redirect to Google OAuth
  };

  const disconnectGoogleLogin = () => {
    disconnectKeylessAccount();
    setAccount(null);
    setWalletType(null);
    setUserName(null);
    navigate('/'); // Redirect to home after logout
  };

  // -------------- FRONTEND UI --------------
  return (
    <nav className="navbar-investor">
      <div className="navbar-container-investor">
        <div className="logo-investor">
          <Link to="/">
            <img src={Logo} alt="Logo" className="logo-image-investor" />
          </Link>
        </div>

        <div className="wallet-investor">
          {!account ? (
            <div className="login-options-investor">
              <button className="wallet-button-investor" onClick={connectPetraWallet}>
                <FaWallet className="wallet-icon-investor" />
                <p>Connect<br />Petra Wallet</p>
              </button>
              <button className="wallet-button-investor" onClick={handleGoogleLogin}>
                <FcGoogle className="wallet-icon-investor" />
                <p>Login with<br />Google</p>
              </button>
            </div>
          ) : (
            <div className="wallet-info-investor">
              {walletType === 'google' ? (
                <>
                  <p>{humanReadableAddress && `Address: ${formatAddress(humanReadableAddress)}`}</p>
                  <button className="button-wallet" onClick={disconnectGoogleLogin}>
                    Disconnect Google
                  </button>
                </>
              ) : (
                <>
                  <p>{`${formatAddress(humanReadableAddress || '')} (${walletType})`}</p>
                  <button className="button-wallet" onClick={disconnectWallet}>Disconnect</button>
                  <button className="button-wallet" onClick={switchWallet}>Switch Wallet</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InvestNavbar;
