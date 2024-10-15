import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './TokenList.css';
import { AptosClient } from "aptos";
import placeholderImage from '/src/assets/testtoken.png'; // Make sure this path is correct

const MODULE_ADDRESS = "0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4";
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";

const BUSINESS_ADDRESSES = [
  '0x18b9dccee7eb6726b6688b91a7c9e7e66c6ed3c33755e34f220d97dd1504c6e4',
  '0x7e293800352a26008ff6aad253f3b585c711b0d429e592c4daff3dcc827c1f62'
];

const TokenList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const client = new AptosClient(NODE_URL);
      try {
        const businessDetails = await Promise.all(BUSINESS_ADDRESSES.map(async (address) => {
          const stake = await client.view({
            function: `${MODULE_ADDRESS}::investment_pool::business_stake`,
            type_arguments: [],
            arguments: [address]
          });

          return {
            address: address,
            name: address === MODULE_ADDRESS ? 'Fishing Business' : 'Agriculture Business',
            stake: stake[0] / 1000000,  // Convert to USDC
            description: address === MODULE_ADDRESS ? 'Fishing industry investment opportunity' : 'Agricultural investment opportunity',
            image: placeholderImage // Using placeholder image for now
          };
        }));

        setBusinesses(businessDetails);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % businesses.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + businesses.length) % businesses.length);
  };

  return (
    <div className="slider-container">
      <div className="slider-content">
        {businesses.map((business, index) => (
          <div
            key={business.address}
            className={`slider-item ${index === currentIndex ? 'active' : ''}`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              opacity: index === currentIndex ? 1 : 0,
              transition: 'transform 0.5s ease, opacity 0.5s ease',
            }}
          >
            <div className="business-info">
              <img src={business.image} alt={business.name} className="business-image" />
              <h2>{business.name}</h2>
              <p>{business.description}</p>
              <p className="business-address">Address: {business.address.slice(0, 6)}...{business.address.slice(-4)}</p>
              <p className="business-stake">Total Stake: {business.stake.toFixed(4)} USDC</p>
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
  );
};

export default TokenList;