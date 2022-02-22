export interface ITransaction {
  from: string;
  to: string;
  data?: string;
  value?: string | number;
  gas?: string | number;
  gasLimit?: string | number;
}

export interface IWallet {
  isWallet(): boolean;
  connect: (chainId: number) => Promise<string>;
  getChainId(): number;
  getAddress: () => Promise<string>;
  sendTransaction: (transaction: ITransaction) => Promise<string>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  isConnected: () => boolean;
  signMessage: (message: string) => void;
}

export enum EConnectType {
  metamask = 'metamask',
  walletconnect = 'walletconnect',
}
