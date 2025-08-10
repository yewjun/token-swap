import { BigNumber } from 'ethers';

export interface Token {
  symbol: string;
  name: string;
  chainId: string;
  address?: string;
  decimals: number;
  logoURI?: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: string;
}

export interface TokenPrice {
  price: BigNumber; // Price in USD with 18 decimals
  priceFormatted: string; // Human readable price
  symbol: string;
  lastUpdated: Date;
}

export interface TokenAmount {
  raw: BigNumber; // Raw amount with token decimals
  formatted: string; // Human readable amount
  usd: BigNumber; // USD value with 18 decimals
  usdFormatted: string; // Human readable USD value
}

export interface SwapCalculation {
  sourceToken: Token;
  targetToken: Token;
  usdAmount: BigNumber;
  sourceAmount: TokenAmount;
  targetAmount: TokenAmount;
  exchangeRate: BigNumber; // source to target rate
}

// API Response types
export interface FunkitTokenResponse {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: string;
}

export interface FunkitPriceResponse {
  price: number; // Price in USD
  symbol?: string;
  timestamp?: number;
}
