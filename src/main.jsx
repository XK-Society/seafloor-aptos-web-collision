import React from 'react';
import FooterBu from './components/footer-business/FooterBu.jsx';
import InvestFooter from './components/footer-invester/InvestFooter.jsx';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom'
import InvestNavbar from './components/navbar-investor/InvestNavbar.jsx';

function MainLayout() {
  const location = useLocation();
  
  const excludePaths = ['/'];
  const isInvestorPath = location.pathname.startsWith('/invest');

  const shouldExclude = excludePaths.includes(location.pathname);

  return (
    <>
      {/* {!shouldExclude && (isInvestorPath ? <InvestNavbar /> : <InvestNavbar />)} */}
      <InvestNavbar />
      <div className='content'>
        <App />
      </div>
      {/* (<InvestFooter /> : <FooterBu />) */}
      {!shouldExclude && (isInvestorPath ? <InvestFooter /> : <FooterBu />)}
    </>
  );
}

export default MainLayout;

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MainLayout />
  </BrowserRouter>,
)
