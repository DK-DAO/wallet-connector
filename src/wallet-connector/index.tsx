import { useState, useReducer, useEffect } from 'react';
import { Buffer as safeBuffer } from 'safe-buffer';
import Button from '@mui/material/Button';
import { WalletConnectorDialog } from './dialog-select-wallet';
import ModalMessage from './modal-message';
import { DefaultWalletConnectorContext, WalletConnectorContext, WalletConnectorReducer } from './context';
import { CoreMetaMask } from './core-meta-mask';
import CoreWalletConnect from './core-wallet-connect';
import { IWallet } from './core';
import { once } from '../utilities/singleton';

declare let localStorage: any;

// @ts-ignore
if (typeof globalThis.Buffer === 'undefined') globalThis.Buffer = safeBuffer;

declare let window: any;

export const VoidWallet = { isWallet: () => false } as IWallet;

export interface IWalletConnectorState {
  connected: boolean;
  address: string;
  chainId: number;
  type: 'unknown' | 'metamask' | 'walletconnect';
  dialogOpen: boolean;
  modalOpen: boolean;
  modalType: 'info' | 'error' | 'success' | 'warning';
  modalTitle: string;
  modalMessage: string;
}

export interface IWalletConnectorProps {
  onConnect: (error: Error | null, walletInstance: IWallet) => void;
}

export const SupportedNetwork = new Map<number, string>([
  [1, 'Ethereum Mainnet'],
  [56, 'Binance Smart Chain'],
  [137, 'Polygon Mainnet'],
  [250, 'Fantom Opera'],
  [4002, 'Fantom Testnet'],
]);

export function WalletConnector(props: IWalletConnectorProps) {
  const [context, dispatch] = useReducer(WalletConnectorReducer, DefaultWalletConnectorContext);
  const [modalState, setModalState] = useState({ title: 'Unknown Error', message: 'Unknown error', type: 'info' });
  const [isConnected, setConnection] = useState(false);

  useEffect(
    () =>
      once('restore-previous-session', () => {
        if (typeof localStorage !== 'undefined') {
          const type = localStorage.getItem('wallet-connector-type') || '';
          const chainId = Number(localStorage.getItem('wallet-connector-chain-id') || 56);
          if (type === 'metamask') {
            const wallet = CoreMetaMask.getInstance();
            if (wallet.isConnected()) {
              wallet.connect(chainId).then(() => {
                setConnection(true);
              });
              props.onConnect(null, wallet);
            }
          } else if (type === 'walletconnect') {
            const wallet = CoreWalletConnect.getInstance();
            if (wallet.isConnected()) {
              setConnection(true);
              props.onConnect(null, wallet);
            }
          }
        }
      }),
    [],
  );

  const overrideDispatch = (type: string, value: any) => dispatch({ type, value });

  const showModal = (type: string, title: string, message: string) => {
    setModalState({ title, type, message });
    overrideDispatch('open-modal', { modalOpen: true });
  };

  const handleDialogClose = (connectType: string) => {
    if (connectType === 'metamask') {
      if (typeof window.ethereum !== 'undefined') {
        const wallet = CoreMetaMask.getInstance();
        wallet
          .connect(56)
          .then((address: string) => {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('wallet-connector-type', connectType);
              localStorage.setItem('wallet-connector-chain-id', 56);
            }
            overrideDispatch('metamask-connected', { connected: true, type: connectType, address });
            props.onConnect(null, wallet);
            setConnection(true);
          })
          .catch((err: Error) => showModal('error', err.message, err.stack || 'Unknown reason'))
          .finally(() => overrideDispatch('close-dialog', { dialogOpen: false }));
      } else {
        showModal('error', 'Metamask Not Found', "Metamask wallet wasn't installed");
      }
    } else if (connectType === 'walletconnect') {
      const wallet = CoreWalletConnect.getInstance();
      wallet
        .connect(56)
        .then((address: string) => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('wallet-connector-type', connectType);
            localStorage.setItem('wallet-connector-chain-id', 56);
          }
          overrideDispatch('walletconnect-connected', { connected: true, type: connectType, address });
          props.onConnect(null, wallet);
          setConnection(true);
        })
        .catch((err: Error) => showModal('error', err.message, err.stack || 'Unknown reason'))
        .finally(() => overrideDispatch('close-dialog', { dialogOpen: false }));
    } else {
      overrideDispatch('close-dialog', { dialogOpen: false });
    }
  };

  const handleButtonConnect = () => {
    overrideDispatch('open-dialog', { dialogOpen: true });
  };

  return (
    <>
      <WalletConnectorContext.Provider value={{ ...context, dispatch: overrideDispatch }}>
        <Button variant="contained" onClick={handleButtonConnect} disabled={isConnected}>
          {!isConnected ? 'Connect' : 'Disconnect'}
        </Button>
        <WalletConnectorDialog onClose={handleDialogClose} />
        <ModalMessage type={modalState.type} title={modalState.title}>
          {modalState.message}
        </ModalMessage>
      </WalletConnectorContext.Provider>
    </>
  );
}

export * from './core';