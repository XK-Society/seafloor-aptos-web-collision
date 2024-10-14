import { FaHome, FaFolder, FaUser } from 'react-icons/fa';
import './InvestFooter.css';
import { NavLink } from 'react-router-dom';

const InvestFooter = () => {
    return (
        <footer className="footer-investor">
            <div className="footer-container-investor">
                <NavLink
                    to='/invest-home'
                    className={({ isActive }) => isActive ? "footer-item-investor active" : "footer-item-investor"}
                >
                    <FaHome className="footer-icon-invest" />
                </NavLink>
                <NavLink
                    to='/invest-dashboard'
                    className={({ isActive }) => isActive ? "footer-item-investor active" : "footer-item-investor"}
                >
                    <FaFolder className="footer-icon-invest" />
                </NavLink>
                <NavLink
                    to='/invest-profile'
                    className={({ isActive }) => isActive ? "footer-item-investor active" : "footer-item-investor"}
                >
                    <FaUser className="footer-icon-invest" />
                </NavLink>
            </div>
        </footer>
    );
};

export default InvestFooter;
