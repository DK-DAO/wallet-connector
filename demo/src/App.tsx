import React, { useCallback, useState } from 'react';
import { IWallet, WalletConnector } from '@orochi-network/wallet-connector';
import './App.css';

function App() {
  const [wallet, setWallet] = useState<null | IWallet>(null);
  const [address, setAddress] = useState<null | string>(null);

  const onConnect = (err: Error | null, wallet: IWallet) => {
    if (err === null) {
      setWallet(wallet);
      wallet.getAddress().then((address) => setAddress(address));
    } else {
      setWallet(null);
    }
  };

  const onDisconnect = useCallback((error: Error | null) => {
    if (!error) {
      setWallet(null);
      setAddress(null);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <WalletConnector onConnect={onConnect} chainId={56} onDisconnect={onDisconnect} />
        <div>
          <p>Connected address: {address || '...'}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
