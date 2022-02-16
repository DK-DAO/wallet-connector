/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { ethers } from 'ethers';

const singleton: { [key: string]: any } = {};

export function formatNumber(v: number | string) {
  if (typeof singleton.formatNumber === 'undefined') {
    singleton.formatNumber = new Intl.NumberFormat('en-US');
  }
  return singleton.formatNumber.format(v);
}

export function getProvider() {
  if (typeof singleton.provider === 'undefined') {
    singleton.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'); // https://bsc-dataseed.binance.org/
  }
  return singleton.provider;
}

const onceSync = new Map<string, boolean>();

export const once = (name: string, callback: () => void) => {
  if (!onceSync.has(name) || !onceSync.get(name)) {
    callback();
    onceSync.set(name, true);
  }
};
