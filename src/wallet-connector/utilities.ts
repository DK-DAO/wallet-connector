export const toChainIdString = (chainId: number): string => `0x${Number(chainId).toString(16)}`;

export const toChainIdNumber = (chainId: string): number => parseInt(chainId.replace(/^0x/i, '').trim(), 16);

export const networkData: { [key: string]: any } = {
  '0x38': {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
};

const onceSync = new Map<string, boolean>();

export const once = (name: string, callback: () => void) => {
  if (!onceSync.has(name) || !onceSync.get(name)) {
    callback();
    onceSync.set(name, true);
  }
};

export const toKey = (v: string): string => v.toLowerCase().replace(/\s/g, '');
