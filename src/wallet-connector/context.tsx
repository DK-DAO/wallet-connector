import React from 'react';

interface IAction {
  type: string;
  value: any;
}

export interface IWalletConnectorContext {
  connected: boolean;
  chainId: number;
  address: string;
  type: string;
  dialogOpen: boolean;
  modalOpen: boolean;
  dispatch: (type: string, value: any) => void;
}

export const DefaultWalletConnectorContext = {
  connected: false,
  chainId: 0,
  address: '',
  type: 'unknown',
  dialogOpen: false,
  modalOpen: false,
  // eslint-disable-next-line no-unused-vars
  dispatch: (_type: string, _value: any): void => {
    throw new Error('dispatch function must be overridden');
  },
};

export const WalletConnectorContext = React.createContext<IWalletConnectorContext>(DefaultWalletConnectorContext);

export const WalletConnectorReducer = (state: IWalletConnectorContext, action: IAction) => {
  return { ...state, ...action.value };
};
