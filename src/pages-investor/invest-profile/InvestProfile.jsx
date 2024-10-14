import React, { useState, useEffect } from 'react';
import { getHeaders } from '../../appUtils';
import './InvestProfile.css'; // Ensure this file contains the necessary styles

const InvestProfile = () => {
    const [investorData, setInvestorData] = useState({
        walletAddress: '',
        name: 'Anonymous',
        balance: ''
    });

    useEffect(() => {
        const fetchInvestorData = async () => {
            try {
                const walletResponse = await fetch(
                    'https://service-testnet.maschain.com/api/wallet/wallet/0xa55eae503f7Bfcaf6357e464c5009110cD6711E6',
                    {
                        method: 'GET',
                        headers: getHeaders(),
                    }
                );

                const walletData = await walletResponse.json();
                const walletInfo = walletData.result;

                setInvestorData(prevState => ({
                    ...prevState,
                    walletAddress: walletInfo.address,
                    name: walletInfo.name
                }));

                const balanceResponse = await fetch(
                    'https://service-testnet.maschain.com/api/token/balance',
                    {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify({
                            wallet_address: walletInfo.address,
                            contract_address: '0xF5757012879C259A1c78f6eE6D60f1d13B42f4f5',
                        }),
                    }
                );

                const balanceData = await balanceResponse.json();

                setInvestorData(prevState => ({
                    ...prevState,
                    balance: `${balanceData.result} SAND`
                }));
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchInvestorData();
    }, []);

    return (
        <div className="profile-page-investor"> 
            <h1 className="header">Profile</h1> 
            <div className="profile-container-investor">
                <div className="profile-info-investor">
                    <div className="profile-item-investor">
                        <span className="profile-label-investor">Wallet:</span>
                        <span className="profile-value-investor">{investorData.walletAddress}</span>
                    </div>
                    <div className="profile-item-investor">
                        <span className="profile-label-investor">Total Invest:</span>
                        <span className="profile-value-investor">{investorData.balance}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestProfile;
