import React, { useState, useEffect } from 'react';
import { AptosClient } from "aptos";
import './Tokenize.css';

const Tokenize = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [client, setClient] = useState(null);
  const [crabBalance, setCrabBalance] = useState(0);
  const [initialCrabAmount, setInitialCrabAmount] = useState('');
  const [isLiquidityPoolInitialized, setIsLiquidityPoolInitialized] = useState(false);
  const [step, setStep] = useState(0); // 0: Mint, 1: Initialize Pool, 2: Register Business
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";

  useEffect(() => {
    const initializeAptos = async () => {
      if ("aptos" in window) {
        const aptosWallet = window.aptos;
        try {
          const response = await aptosWallet.connect();
          setWalletAddress(response.address);
          const newClient = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");
          setClient(newClient);
          await fetchCrabBalance(response.address, newClient);
        } catch (error) {
          console.error("Failed to connect to Aptos wallet:", error);
        }
      }
    };

    initializeAptos();
  }, []);

  const fetchCrabBalance = async (address, aptosClient) => {
    try {
      const resource = await aptosClient.getAccountResource(
        address,
        `${MODULE_ADDRESS}::crab_token::CrabToken`
      );
      if (resource && resource.data && resource.data.balance) {
        setCrabBalance(resource.data.balance);
      } else {
        console.error("Unexpected resource structure:", resource);
        setCrabBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch CRAB balance:", error);
      setCrabBalance(0);
    }
  };

  const mintCrabTokens = async (amount) => {
    if (!client || !walletAddress) return;

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::crab_token::mint`,
        type_arguments: [],
        arguments: [walletAddress, amount.toString()]
      };

      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(pendingTransaction.hash);
      await fetchCrabBalance(walletAddress, client);
      console.log("CRAB tokens minted successfully");
      setSuccessMessage("CRAB tokens minted successfully!");
      setTransactionHash(pendingTransaction.hash);
      setShowSuccessPopup(true);
      await checkLiquidityPoolInitialized();
    } catch (error) {
      console.error("Failed to mint CRAB tokens:", error);
    }
  };

  const checkLiquidityPoolInitialized = async () => {
    try {
      await client.getAccountResource(
        MODULE_ADDRESS,
        `${MODULE_ADDRESS}::investment_pool::LiquidityPool`
      );
      setIsLiquidityPoolInitialized(true);
      setStep(2); // Move to register business step
    } catch (error) {
      if (error.status === 404) {
        setIsLiquidityPoolInitialized(false);
        setStep(1); // Move to initialize liquidity pool step
      } else {
        console.error("Failed to check liquidity pool status:", error);
      }
    }
  };

  const initializeLiquidityPool = async () => {
    if (!client || !walletAddress) return;

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::investment_pool::initialize`,
        type_arguments: [],
        arguments: []
      };

      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(pendingTransaction.hash);
      console.log("Liquidity pool initialized successfully");
      setIsLiquidityPoolInitialized(true);
      setStep(2); // Move to register business step
      setSuccessMessage("Liquidity pool initialized successfully!");
      setTransactionHash(pendingTransaction.hash);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Failed to initialize liquidity pool:", error);
    }
  };

  const registerBusiness = async () => {
    if (!client || !walletAddress) return;

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::investment_pool::register_business`,
        type_arguments: [],
        arguments: [walletAddress, initialCrabAmount]
      };

      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(pendingTransaction.hash);
      console.log("Business registered successfully");
      setInitialCrabAmount('');
      setStep(0); // Reset to initial step
      setSuccessMessage("Business registered successfully!");
      setTransactionHash(pendingTransaction.hash);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Failed to register business:", error);
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    if (businessName && businessDescription) {
      await mintCrabTokens(10000000000000); // Minting 1000 CRAB tokens as an example
    }
  };

  const handleRegisterBusiness = async (e) => {
    e.preventDefault();
    if (initialCrabAmount) {
      await registerBusiness();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <form className="token-desc" onSubmit={handleMint}>
            <div className="desc-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter Business Name"
                required
              />
            </div>
            <div className="desc-group">
              <label htmlFor="businessDescription">Business Description</label>
              <textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Enter Business Description"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Mint CRAB Tokens
            </button>
          </form>
        );
      case 1:
        return (
          <div className="token-summary">
            <h2>Initialize Liquidity Pool</h2>
            <p>The liquidity pool needs to be initialized before you can register your business.</p>
            <button onClick={initializeLiquidityPool} className="submit-button">
              Initialize Liquidity Pool
            </button>
          </div>
        );
      case 2:
        return (
          <div className="token-summary">
            <h2>Register Business</h2>
            <p><strong>Business Name:</strong> {businessName}</p>
            <p><strong>Business Description:</strong> {businessDescription}</p>
            <p><strong>CRAB Balance:</strong> {crabBalance}</p>
            <form onSubmit={handleRegisterBusiness}>
              <div className="desc-group">
                <label htmlFor="initialCrabAmount">Initial CRAB Amount</label>
                <input
                  type="number"
                  id="initialCrabAmount"
                  value={initialCrabAmount}
                  onChange={(e) => setInitialCrabAmount(e.target.value)}
                  placeholder="Enter initial CRAB amount"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Register Business
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="token">
      <h1>Tokenize your business!</h1>
      <div className="token-desc-container">
        {renderStep()}
      </div>
      {showSuccessPopup && (
        <div className="success-popup">
          <p>{successMessage}</p>
          <a
            href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction on Aptos Explorer
          </a>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Tokenize;