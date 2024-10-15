import React, { useState, useEffect } from 'react';
import { AptosClient } from "aptos";
import './InvestProfile.css';

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";

const InvestProfile = () => {
    const [investorData, setInvestorData] = useState({
        walletAddress: '',
        totalInvestment: 0
    });

    useEffect(() => {
        const fetchInvestorData = async () => {
            if ("aptos" in window) {
                try {
                    const aptosWallet = window.aptos;
                    const response = await aptosWallet.connect();
                    const walletAddress = response.address;

                    const client = new AptosClient(NODE_URL);
                    const totalInvestment = await fetchTotalInvestment(client, walletAddress);

                    setInvestorData({
                        walletAddress: walletAddress,
                        totalInvestment: totalInvestment
                    });
                } catch (error) {
                    console.error('Error fetching investor data:', error);
                }
            } else {
                console.error('Aptos wallet not found');
            }
        };

        fetchInvestorData();
    }, []);

    const fetchTotalInvestment = async (client, address) => {
        try {
            const investorStake = await client.view({
                function: `${MODULE_ADDRESS}::investment_pool::investor_stake`,
                type_arguments: [],
                arguments: [address]
            });
            return investorStake[0] / 1000000; // Convert to USDC
        } catch (error) {
            console.error('Error fetching total investment:', error);
            return 0;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Wallet address copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="profile-page-investor">
            <h1 className="header">Profile</h1>
            <div className="profile-container-investor">
                <div className="profile-info-investor">
                    <div className="profile-item-investor">
                        <span className="profile-label-investor">Wallet:</span>
                        <div className="wallet-display">
                            <span className="profile-value-investor wallet-address">
                                {investorData.walletAddress 
                                    ? `${investorData.walletAddress.slice(0, 6)}...${investorData.walletAddress.slice(-4)}`
                                    : 'Not connected'}
                            </span>
                            {investorData.walletAddress && (
                                <button className="profile-copy-button" onClick={() => copyToClipboard(investorData.walletAddress)}>
                                    Copy
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="profile-item-investor">
                        <span className="profile-label-investor">Total Investment:</span>
                        <span className="profile-value-investor">{investorData.totalInvestment.toFixed(4)} USDC</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestProfile;