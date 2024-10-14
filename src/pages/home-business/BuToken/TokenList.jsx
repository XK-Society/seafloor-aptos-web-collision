import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './TokenList.css'

const businesses = [
    { name: 'Token 1', image: '/src/assets/testtoken.png', description: 'Lorem ipsom meow meow'},
    { name: 'Token 2', image: '/src/assets/testtoken.png', description: 'Lorem ipsom meow meow'},
    { name: 'Token 3', image: '/src/assets/testtoken.png', description: 'Lorem ipsom meow meow'},
    { name: 'Token 4', image: '/src/assets/testtoken.png', description: 'Lorem ipsom meow meow' }
];

const TokenList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
            key={business.name}
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