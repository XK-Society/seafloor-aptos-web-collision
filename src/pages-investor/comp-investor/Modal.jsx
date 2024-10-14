import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Reminder</h2>
                <p>Please connect your wallet to proceed with the investment.</p>
                <div className="modal-buttons">
                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
