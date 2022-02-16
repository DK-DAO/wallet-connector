import React from 'react';
import { WalletConnector } from 'wallet-connector';
import './App.css';

function App() {
  const onConnect = (event: any) => {
    console.log(event);
  };
  return (
    <div className="App">
      <WalletConnector onConnect={onConnect} />
    </div>
  );
}

export default App;
