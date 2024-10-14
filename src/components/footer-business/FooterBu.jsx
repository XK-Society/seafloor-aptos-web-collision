import { FaHome, FaFolder, FaUser } from 'react-icons/fa';
import './FooterBu.css';
import { NavLink } from 'react-router-dom';

const FooterBu = () => {
    return (
        <footer className="footer-business">
            <div className="footer-container-business">
                <NavLink
                    to='/homebu'
                    className={({ isActive }) => isActive ? "footer-item-business active" : "footer-item-business"}
                >
                    <FaHome className="footer-icon-business" />
                </NavLink>
                <NavLink
                    to='/dashboardbu'
                    className={({ isActive }) => isActive ? "footer-item-business active" : "footer-item-business"}
                >
                    <FaFolder className="footer-icon-business" />
                </NavLink>
                <NavLink
                    to='/profilebu'
                    className={({ isActive }) => isActive ? "footer-item-business active" : "footer-item-business"}
                >
                    <FaUser className="footer-icon-business" />
                </NavLink>
            </div>
        </footer>
    );
};

export default FooterBu;


// import React, { useState } from 'react';
// import { FaHome, FaFolder, FaUser } from 'react-icons/fa';
// import './FooterBu.css';
// import { Link } from 'react-router-dom';

// const FooterBu = () => {
  
//   return (
//     <footer className="footer">
//       <div className="footer-container">
//           <Link to='/' className="footer-item">
//             <FaHome className="footer-icon" />
//             <span>Home</span>
//           </Link>
//           <Link to='/dashboardbu' className="footer-item">
//             <FaFolder className="footer-icon" />
//             <span>Dashboard</span>
//           </Link>
//           <Link to='/profileBu' className="footer-item">
//             <FaUser className="footer-icon" />
//             <span>Profile</span>
//           </Link>
//       </div>
//     </footer>
//   );
// };

// export default FooterBu;
