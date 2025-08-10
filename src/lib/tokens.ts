import { Token } from '../types/token';

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    chainId: '1',
    decimals: 6,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    chainId: '137',
    decimals: 6,
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    chainId: '8453',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    chainId: '1',
    decimals: 8,
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
  }
];

export function getTokenBySymbol(symbol: string): Token | undefined {
  return SUPPORTED_TOKENS.find(token => token.symbol === symbol);
}

export function getTokensByChain(chainId: string): Token[] {
  return SUPPORTED_TOKENS.filter(token => token.chainId === chainId);
}