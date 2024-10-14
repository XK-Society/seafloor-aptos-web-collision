import React, { useState, useEffect } from 'react';
import { AptosClient } from "aptos";
import './Tokenize.css';

const Tokenize = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [client, setClient] = useState(null);
  const [crabBalance, setCrabBalance] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const MODULE_ADDRESS = "0xdb9e0c026f8b61da781e54bbfab64de72d85fff537c0ca872648aa0cac7f3c07";

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
      setCrabBalance(resource.data.balance);
    } catch (error) {
      console.error("Failed to fetch CRAB balance:", error);
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
    } catch (error) {
      console.error("Failed to mint CRAB tokens:", error);
    }
  };

  const investInPool = async (amount) => {
    if (!client || !walletAddress) return;

    const LIQUIDITY_POOL_ADDRESS = "0xb1c52baf095e058aa36ec4c6e9bf341a9871e72fc7338946f02df78c3d9bf139";

    try {
        const payload = {
            type: "entry_function_payload",
            function: `${MODULE_ADDRESS}::crab_token::transfer`,
            type_arguments: [],
            arguments: [walletAddress, LIQUIDITY_POOL_ADDRESS, amount.toString()]
        };

        const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
        await client.waitForTransaction(pendingTransaction.hash);
        await fetchCrabBalance(walletAddress, client);
        console.log("CRAB tokens transferred to liquidity pool successfully");
    } catch (error) {
        console.error("Failed to transfer CRAB tokens to liquidity pool:", error);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tokenName && tokenDescription) {
      setSubmitted(true);
      // Mint some initial CRAB tokens for the business
      await mintCrabTokens(10000000000000); // Minting 1000 CRAB tokens as an example
    }
  };

  const handleInvestment = async (e) => {
    e.preventDefault();
    if (investmentAmount) {
      await investInPool(parseInt(investmentAmount));
      setInvestmentAmount('');
    }
  };

  return (
    <div className="token">
      <h1>Tokenize your business!</h1>
      <div className="token-desc-container">
        {!submitted ? (
          <form className="token-desc" onSubmit={handleSubmit}>
            <div className="desc-group">
              <label htmlFor="tokenName">Business Name</label>
              <input
                type="text"
                id="tokenName"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Enter Business Name"
                required
              />
            </div>
            <div className="desc-group">
              <label htmlFor="tokenDescription">Business Description</label>
              <textarea
                id="tokenDescription"
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
                placeholder="Enter Business Description"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit and Mint CRAB Tokens
            </button>
          </form>
        ) : (
          <div className="token-summary">
            <h2>Token Summary</h2>
            <p><strong>Token Name:</strong> {tokenName}</p>
            <p><strong>Token Description:</strong> {tokenDescription}</p>
            <p><strong>CRAB Balance:</strong> {crabBalance}</p>
            <form onSubmit={handleInvestment}>
              <div className="desc-group">
                <label htmlFor="investmentAmount">Investment Amount</label>
                <input
                  type="number"
                  id="investmentAmount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter investment amount"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Invest in Pool
              </button>
            </form>
            <button className="new-token-button" onClick={() => setSubmitted(false)}>
              Create Another Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tokenize;