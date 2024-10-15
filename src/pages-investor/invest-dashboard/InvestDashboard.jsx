import React, { useEffect, useState } from 'react';
import './InvestDashboard.css';
import DashImage from '../../assets/turtle.gif';
import { AptosClient } from "aptos";

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";

const InvestDashboard = () => {
    const [businessStakes, setBusinessStakes] = useState({});

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
        const fetchBusinessStakes = async () => {
            const client = new AptosClient(NODE_URL);
            const stakes = {};
            for (let token of tokens) {
                try {
                    const stake = await client.view({
                        function: `${MODULE_ADDRESS}::investment_pool::business_stake`,
                        type_arguments: [],
                        arguments: [token.id]
                    });
                    stakes[token.id] = stake[0];
                } catch (error) {
                    console.error(`Failed to fetch stake for ${token.name}:`, error);
                    stakes[token.id] = 0;
                }
            }
            setBusinessStakes(stakes);
        };

        fetchBusinessStakes();
    }, []);

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
                            <div className="token-address-container">
                                <span className="token-address">Address: {shortenAddress(token.id)}</span>
                                <button className="copy-button" onClick={() => copyToClipboard(token.id)}>
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestDashboard;