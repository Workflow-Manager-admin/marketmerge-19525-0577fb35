import React from 'react';
import './App.css';
import './MarketMergeContainer.css';
import MarketMergeContainer from './MarketMergeContainer';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app" style={{ background: "var(--mm-bg)", minHeight: "100vh" }}>
      <nav className="navbar" style={{ background: "#1976D2" }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <div className="logo" style={{ color: "#fff" }}>
              <span className="logo-symbol" style={{ color: "#43A047" }}>*</span>
              MarketMerge
            </div>
          </div>
        </div>
      </nav>
      <main>
        <MarketMergeContainer />
      </main>
    </div>
  );
}

export default App;
