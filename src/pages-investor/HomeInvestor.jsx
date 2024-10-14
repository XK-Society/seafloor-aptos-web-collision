import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HomeInvestor.css';
import { useNavigate } from 'react-router-dom';
import TokenImage from '../assets/turtle.gif';
import { AptosClient, AptosAccount, FaucetClient, TokenClient } from "aptos";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MODULE_ADDRESS = "0xdb9e0c026f8b61da781e54bbfab64de72d85fff537c0ca872648aa0cac7f3c07";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const EXPLORER_URL = "https://explorer.aptoslabs.com/txn";

const defaultTokens = [
    { id: 1, name: 'Fishing Business ', price: '1000 APT', desc: 'Buy the CRAB Tokens', image: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Agriculture Business', price: '2000 APT', desc: 'Buy the CRAB Tokens', image: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Fruit business', price: '3000 APT', desc: 'Buy the CRAB Tokens', image: 'https://via.placeholder.com/50' },
    { id: 4, name: 'Animal farm business', price: '4000 APT', desc: 'Buy the CRAB Tokens', image: 'https://via.placeholder.com/50' },
];

const InTokenList = ({ tokens = defaultTokens }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTokenName, setSelectedTokenName] = useState('');
    const [walletAddress, setWalletAddress] = useState(null);
    const [client, setClient] = useState(null);
    const [transactionHash, setTransactionHash] = useState('');
    const slideAnim = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAptos = async () => {
            if ("aptos" in window) {
                const aptosWallet = window.aptos;
                try {
                    const response = await aptosWallet.connect();
                    setWalletAddress(response.address);
                    const newClient = new AptosClient(NODE_URL);
                    setClient(newClient);
                } catch (error) {
                    console.error("Failed to connect to Aptos wallet:", error);
                }
            }
        };

        initializeAptos();
    }, []);

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
        setTransactionHash(''); // Reset transaction hash when closing the modal
    };

    const handleConfirmPurchase = async () => {
        if (!client || !walletAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const payload = {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::crab_token::mint`,
                type_arguments: [],
                arguments: [walletAddress, "1000000000"] // Minting 10 CRAB tokens (assuming 8 decimal places)
            };

            const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);
            await client.waitForTransaction(pendingTransaction.hash);
            setTransactionHash(pendingTransaction.hash);
            console.log("CRAB tokens minted successfully");
        } catch (error) {
            console.error("Failed to mint CRAB tokens:", error);
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
                       <p>{token.price}</p>
                        <button className="tokenButton" onClick={() => handleButtonPress(token)}>
                            Buy Tokens
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

            {modalVisible && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        {!transactionHash ? (
                            <>
                                <h3 className="purchased-noty">Buy {selectedTokenName}?</h3>
                                <div className="modalButtons">
                                    <button className="modalButton" onClick={handleConfirmPurchase}>
                                        Confirm
                                    </button>
                                    <button className="modalButton closeButton" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="purchased-noty">Yeay! You received {selectedTokenName}.</h3>
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