import React, { useEffect, useState } from 'react';
import './InvestDashboard.css';
import DashImage from '../../assets/turtle.gif';
import { AptosClient } from "aptos";

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";

const InvestDashboard = () => {
    const [businessStakes, setBusinessStakes] = useState({});
    const [investorStakes, setInvestorStakes] = useState({});
    const [walletAddress, setWalletAddress] = useState(null);
    const [client, setClient] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [divestAmount, setDivestAmount] = useState('');

    const tokens = [
        {
            id: '0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4',
            name: 'Fishing Business',
            description: 'Dont be shy, invest more',
        },
        {
            id: '0x7e293800352a26008ff6aad253f3b585c711b0d429e592c4daff3dcc827c1f62',
            name: 'Agriculture Business',
            description: 'Dont be shy, invest more',
        },
    ];

    useEffect(() => {
        const initializeAptos = async () => {
            if ("aptos" in window) {
                const aptosWallet = window.aptos;
                try {
                    const response = await aptosWallet.connect();
                    setWalletAddress(response.address);
                    const newClient = new AptosClient(NODE_URL);
                    setClient(newClient);
                    await fetchStakes(newClient, response.address);
                } catch (error) {
                    console.error("Failed to connect to Aptos wallet:", error);
                }
            }
        };

        initializeAptos();
    }, []);

    const fetchStakes = async (aptosClient, investorAddress) => {
        const businessStakesData = {};
        const investorStakesData = {};
        for (let token of tokens) {
            try {
                const businessStake = await aptosClient.view({
                    function: `${MODULE_ADDRESS}::investment_pool::business_stake`,
                    type_arguments: [],
                    arguments: [token.id]
                });
                businessStakesData[token.id] = businessStake[0];

                const investorStake = await aptosClient.view({
                    function: `${MODULE_ADDRESS}::investment_pool::investor_stake`,
                    type_arguments: [],
                    arguments: [investorAddress]
                });
                investorStakesData[token.id] = investorStake[0];
            } catch (error) {
                console.error(`Failed to fetch stake for ${token.name}:`, error);
                businessStakesData[token.id] = 0;
                investorStakesData[token.id] = 0;
            }
        }
        setBusinessStakes(businessStakesData);
        setInvestorStakes(investorStakesData);
    };

    const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Address copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const handleDivestClick = (token) => {
        setSelectedToken(token);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedToken(null);
        setDivestAmount('');
    };

    const handleDivest = async () => {
        if (!client || !walletAddress || !selectedToken || !divestAmount) return;
        try {
            const amountInSmallestUnit = Math.floor(parseFloat(divestAmount) * 1000000).toString();
            const payload = {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::investment_pool::divest`,
                type_arguments: [],
                arguments: [walletAddress, selectedToken.id, amountInSmallestUnit]
            };
            const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
            await client.waitForTransaction(pendingTransaction.hash);
            console.log("Divested successfully");
            await fetchStakes(client, walletAddress);
            handleCloseModal();
        } catch (error) {
            console.error("Failed to divest:", error);
        }
    };

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
                            <p className="token-invest">Total Stake: {((businessStakes[token.id] || 0) / 1000000).toFixed(4)} USDC</p>
                            <p className="token-invest">Your Stake: {((investorStakes[token.id] || 0) / 1000000).toFixed(4)} USDC</p>
                            <div className="token-address-container">
                                <span className="token-address">Address: {shortenAddress(token.id)}</span>
                                <button className="copy-button" onClick={() => copyToClipboard(token.id)}>
                                    Copy
                                </button>
                            </div>
                            <button className="divest-button" onClick={() => handleDivestClick(token)}>
                                Divest
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalVisible && selectedToken && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Divest from {selectedToken.name}</h3>
                        <input
                            type="number"
                            value={divestAmount}
                            onChange={(e) => setDivestAmount(e.target.value)}
                            placeholder="Enter USDC amount to divest"
                            className="divest-input"
                        />
                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={handleDivest}>
                                Confirm
                            </button>
                            <button className="cancel-button" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestDashboard;