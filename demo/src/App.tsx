import React, { useCallback, useState } from 'react';
import { IWallet, WalletConnector } from 'wallet-connector';
import './App.css';

function App() {
  const [wallet, setWallet] = useState<null | IWallet>(null);
  const [address, setAddress] = useState<null | string>(null);
  const [chainId, setChainId] = useState<number>(56);

  const onConnect = (err: Error | null, connectedWallet: IWallet) => {
    console.log(connectedWallet);
    if (err === null) {
      setWallet(connectedWallet);
      connectedWallet.getAddress().then((address) => setAddress(address));
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

  const handleInputChainId = (event: any) => {
    setChainId(+event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <WalletConnector onConnect={onConnect} chainId={chainId} onDisconnect={onDisconnect} />
        <div>
          <input type={'number'} value={chainId} onChange={handleInputChainId}></input>
        </div>
        <div>
          <p>Connected address: {address || '...'}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
