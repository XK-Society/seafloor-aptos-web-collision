import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HomeInvestor.css';
import TokenImage from '../assets/turtle.gif';
import { AptosClient } from "aptos";

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const EXPLORER_URL = "https://explorer.aptoslabs.com/txn";

const defaultTokens = [
    { id: '0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4', name: 'Fishing Business', desc: 'Buy the CRAB Tokens', image: 'https://via.placeholder.com/50' },
    { id: '0x7e293800352a26008ff6aad253f3b585c711b0d429e592c4daff3dcc827c1f62', name: 'Agriculture Business', desc: 'Buy the CRAB Tokens', image: 'https://via.placeholder.com/50' },
];

const InTokenList = ({ tokens = defaultTokens }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTokenName, setSelectedTokenName] = useState('');
    const [walletAddress, setWalletAddress] = useState(null);
    const [client, setClient] = useState(null);
    const [transactionHash, setTransactionHash] = useState('');
    const [businessStakes, setBusinessStakes] = useState({});
    const [investorStakes, setInvestorStakes] = useState({});
    const [investAmount, setInvestAmount] = useState('');

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
        try {
            const businessStakesData = {};
            const investorStakesData = {};
            for (let token of tokens) {
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
            }
            setBusinessStakes(businessStakesData);
            setInvestorStakes(investorStakesData);
        } catch (error) {
            console.error("Failed to fetch stakes:", error);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % tokens.length);
    };
    
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + tokens.length) % tokens.length);
    };

    const handleButtonPress = (token) => {
        setSelectedTokenName(token.name);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setTransactionHash('');
        setInvestAmount('');
    };

    const initializeUSDC = async () => {
        if (!client || !walletAddress) return;
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::mock_usdc::initialize`,
                type_arguments: [],
                arguments: []
            };
            const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
            await client.waitForTransaction(pendingTransaction.hash);
            console.log("USDC initialized successfully");
        } catch (error) {
            console.error("Failed to initialize USDC:", error);
        }
    };

    const mintUSDC = async () => {
        if (!client || !walletAddress) return;
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::mock_usdc::mint`,
                type_arguments: [],
                arguments: [walletAddress, "1000000000"] // Minting 1000 USDC (assuming 6 decimal places)
            };
            const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
            await client.waitForTransaction(pendingTransaction.hash);
            console.log("1000 USDC minted successfully");
            await fetchStakes(client, walletAddress);
        } catch (error) {
            console.error("Failed to mint USDC:", error);
        }
    };

    const investInPool = async () => {
        if (!client || !walletAddress || !investAmount) return;
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::investment_pool::invest`,
                type_arguments: [],
                arguments: [tokens[currentIndex].id, investAmount]
            };
            const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
            await client.waitForTransaction(pendingTransaction.hash);
            setTransactionHash(pendingTransaction.hash);
            await fetchStakes(client, walletAddress);
            console.log("Invested in pool successfully");
        } catch (error) {
            console.error("Failed to invest in pool:", error);
        }
    };

    const openExplorerLink = () => {
        if (transactionHash) {
            window.open(`${EXPLORER_URL}/${transactionHash}`, '_blank');
        }
    };

    return (
        <div className="container-home">
            <h2 className="investText">Invest in Interested Business!</h2>
            <h3 className="tokentitle">List Of Tokens</h3>
            <div className="slider-container">
                <div className="slider-content">
                    {tokens.map((token, index) => (
                        <div
                            key={token.id}
                            className={`slider-item ${index === currentIndex ? 'active' : ''}`}
                            style={{
                                transform: `translateX(${(index - currentIndex) * 100}%)`,
                                opacity: index === currentIndex ? 1 : 0,
                                transition: 'transform 0.5s ease, opacity 0.5s ease',
                            }}
                        >
                            <div className="business-info">
                                <img src={TokenImage} alt={token.name} className="token-image" />
                                <h2>{token.name}</h2>
                                <p>{token.desc}</p>
                                <p>Business Stake: {(businessStakes[token.id] || 0) / 1000000} USDC</p>
                                <p>Your Stake: {(investorStakes[token.id] || 0) / 1000000} USDC</p>
                                <button className="tokenButton" onClick={() => handleButtonPress(token)}>
                                    Invest
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={prevSlide} className="slider-button prev">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="slider-button next">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="usdc-actions">
                <button className="tokenButton white-stroke" onClick={initializeUSDC}>Initialize USDC</button>
                <button className="tokenButton white-stroke" onClick={mintUSDC}>Mint 1000 USDC</button>
            </div>

            {modalVisible && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        {!transactionHash ? (
                            <>
                                <h3 className="purchased-noty">Invest in {selectedTokenName}?</h3>
                                <input
                                    type="number"
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(e.target.value)}
                                    placeholder="Enter USDC amount"
                                    className="invest-input"
                                />
                                <div className="modalButtons">
                                    <button className="modalButton" onClick={investInPool}>
                                        Confirm
                                    </button>
                                    <button className="modalButton closeButton" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="purchased-noty">Investment successful!</h3>
                                <div className="modalButtons">
                                    <button className="modalButton" onClick={openExplorerLink}>
                                        View Transaction
                                    </button>
                                    <button className="modalButton closeButton" onClick={handleCloseModal}>
                                        Close
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InTokenList;