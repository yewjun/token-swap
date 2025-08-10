import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import { Token, FunkitTokenResponse, FunkitPriceResponse } from '../types/token';
import { BigNumber } from 'ethers';
import { unitPriceToBigNumber } from './bigNumber';

// Get API key from environment variables (processed by rspack DefinePlugin)
const API_KEY = import.meta.env.VITE_FUNKIT_API_KEY;

if (!API_KEY) {
  console.error('Please create a .env.local file with your API key or set it as an environment variable');
}

/**
 * Fetch detailed token information from Funkit API
 */
export async function fetchTokenInfo(token: Token): Promise<FunkitTokenResponse> {
  try {
    const response = await getAssetErc20ByChainAndSymbol({
      chainId: token.chainId,
      symbol: token.symbol,
      apiKey: API_KEY
    });
    
    return {
      address: response.address || token.address || '',
      symbol: response.symbol || token.symbol,
      name: response.name || token.name,
      decimals: response.decimals || token.decimals,
      chainId: response.chain || token.chainId
    };
  } catch (error) {
    console.warn(`Failed to fetch token info for ${token.symbol}:`, error);
    
    // Return token with defaults
    return {
      address: token.address || '',
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      chainId: token.chainId
    };
  }
}

/**
 * Fetch token price with BigNumber precision and timestamp
 */
export async function fetchTokenPrice(token: Token): Promise<{ price: BigNumber; unitPrice: number; lastUpdated: Date }> {
  const fetchTime = new Date();
  
  try {
    // First try to get token info for the correct address
    const tokenInfo = await fetchTokenInfo(token);
    
    const response = await getAssetPriceInfo({
      chainId: token.chainId,
      assetTokenAddress: tokenInfo.address,
      apiKey: API_KEY
    });

    if (!response.unitPrice || typeof response.unitPrice !== 'number') {
      throw new Error(`Invalid price data received for ${token.symbol}`);
    }
    
    const unitPrice = response.unitPrice;
    const priceBigNumber = unitPriceToBigNumber(unitPrice);
    
    return {
      price: priceBigNumber,
      unitPrice,
      lastUpdated: fetchTime
    };
  } catch (error) {
    console.warn(`Failed to fetch price for ${token.symbol}:`, error);
    throw new Error(`Unable to fetch price for ${token.symbol}. API may be unavailable.`);
  }
}

/**
 * Fetch multiple token prices efficiently with timestamps
 */
export async function fetchMultipleTokenPrices(tokens: Token[]): Promise<{
  prices: Record<string, { price: BigNumber; unitPrice: number; lastUpdated: Date }>;
  errors: Record<string, string>;
}>  {
  try {
    const pricePromises = tokens.map(async (token) => {
      try {
        const result = await fetchTokenPrice(token);
        return { symbol: token.symbol, result, error: null };
      } catch (error) {
        return { 
          symbol: token.symbol, 
          result: null, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
    
    const results = await Promise.all(pricePromises);
    const prices: Record<string, { price: BigNumber; unitPrice: number; lastUpdated: Date }> = {};
    const errors: Record<string, string> = {};

    results.forEach(({ symbol, result, error }) => {
      if (result) {
        prices[symbol] = result;
      } else if (error) {
        errors[symbol] = error;
      }
    });
    
    return { prices, errors };
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    throw error;
  }
}