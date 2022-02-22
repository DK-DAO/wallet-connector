/* eslint-disable class-methods-use-this */
import { ethers } from 'ethers';
import { ITransaction, IWallet } from './core';
import { networkData, toChainIdString } from './utilities';

type TRpcMethod =
  | 'eth_requestAccounts'
  | 'eth_sendTransaction'
  | 'wallet_switchEthereumChain'
  | 'wallet_addEthereumChain'
  | 'personal_sign';

declare let ethereum: {
  request: (rpcRequest: { method: TRpcMethod; params?: any[] }) => Promise<any>;
  chainId: string;
  selectedAddress: string | null;
};

const singleton = new Map<string, any>();

export class CoreMetaMask implements IWallet {
  private chainId: number = 0;

  private address: string = '';

  public getChainId(): number {
    return this.chainId;
  }

  public isWallet(): boolean {
    return true;
  }

  public static getInstance(instanceName: string = 'metamask'): CoreMetaMask {
    if (!singleton.has(instanceName)) {
      singleton.set(instanceName, new CoreMetaMask());
    }
    return singleton.get(instanceName) as CoreMetaMask;
  }

  public async connect(chainId: number) {
    if (chainId === 0) throw new Error('Invalid chainId');
    const [walletAddress] = await ethereum.request({ method: 'eth_requestAccounts' });
    this.address = walletAddress;
    this.chainId = chainId;
    // We are on different network
    if (ethereum.chainId !== toChainIdString(chainId)) {
      await this.switchNetwork(chainId);
    }
    return walletAddress;
  }

  public async getAddress(): Promise<string> {
    if (ethereum.selectedAddress !== null && !ethers.utils.isAddress(this.address)) {
      // Try to reconnect to correct the issue
      this.address = ethereum.selectedAddress;
    }
    return this.address;
  }

  public async switchNetwork(chainId: number): Promise<boolean> {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toChainIdString(chainId) }],
      });
    } catch (e) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkData[toChainIdString(chainId)] || {}],
      });
    }
    return true;
  }

  public async sendTransaction(transaction: ITransaction): Promise<string> {
    return ethereum.request({ method: 'eth_sendTransaction', params: [transaction] });
  }

  public isConnected(): boolean {
    return ethers.utils.isAddress(ethereum.selectedAddress || '');
  }

  public async signMessage(message: string): Promise<string> {
    return ethereum.request({
      method: 'personal_sign',
      params: [message, await this.getAddress()],
    });
  }
}

export default CoreMetaMask;
