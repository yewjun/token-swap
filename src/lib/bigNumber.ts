import { BigNumber, utils } from 'ethers';

// Constants for precise calculations
export const USD_DECIMALS = 2;
export const DEFAULT_TOKEN_DECIMALS = 18;

/**
 * Format BigNumber to human readable string with specified decimals
 * Always rounds down (truncates) - never rounds up
 */
export function formatBigNumber(
  value: BigNumber, 
  decimals: number = DEFAULT_TOKEN_DECIMALS, 
  displayDecimals: number = 6
): string {
  try {
    const formatted = utils.formatUnits(value.toString(), decimals);
    const num = parseFloat(formatted);
    
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    
    // Truncate to displayDecimals instead of rounding
    const multiplier = Math.pow(10, displayDecimals);
    const truncated = Math.floor(num * multiplier) / multiplier;
    
    return truncated.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayDecimals
    });
  } catch (error) {
    console.error('Error formatting BigNumber:', error);
    return '0';
  }
}

/**
 * Parse string to BigNumber with specified decimals
 * Truncates excess decimal places instead of rounding
 */
export function parseToBigNumber(value: string, decimals: number = DEFAULT_TOKEN_DECIMALS): BigNumber {
    try {
      if (!value || value === '') return BigNumber.from(0);
      
      // Remove any non-numeric characters except decimal point
      let cleanValue = value.replace(/[^0-9.]/g, '');
      if (cleanValue === '') return BigNumber.from(0);
      
      // Truncate to specified decimals if needed
      const parts = cleanValue.split('.');
      if (parts.length === 2 && parts[1].length > decimals) {
        cleanValue = parts[0] + '.' + parts[1].substring(0, decimals);
      }
      
      return utils.parseUnits(cleanValue, decimals);
    } catch (error) {
      console.error('Error parsing to BigNumber:', error);
      return BigNumber.from(0);
    }
  }
  
  /**
   * Convert unit price (number) to BigNumber
   * Always truncates instead of rounding
   */
  export function unitPriceToBigNumber(unitPrice: number): BigNumber {
    try {
      if (!isFinite(unitPrice) || unitPrice < 0) return BigNumber.from(0);
      
      // Truncate to 18 decimal places instead of using toFixed which rounds
      const multiplier = Math.pow(10, DEFAULT_TOKEN_DECIMALS);
      const truncated = Math.floor(unitPrice * multiplier) / multiplier;
      const priceString = truncated.toString();
      
      return utils.parseUnits(priceString, DEFAULT_TOKEN_DECIMALS);
    } catch (error) {
      console.error('Error converting USD to BigNumber:', error);
      return BigNumber.from(0);
    }
  }
  
  /**
   * Calculate token amount from USD amount and token price
   * Uses BigNumber integer division which floors the result
   */
  export function calculateTokenAmount(
    usdAmount: BigNumber,
    tokenPrice: BigNumber,
    tokenDecimals: number = DEFAULT_TOKEN_DECIMALS
  ): BigNumber {
    try {
      if (tokenPrice.isZero()) return BigNumber.from(0);
      
      // usdAmount (18 decimals) / tokenPrice (18 decimals) = ratio (18 decimals)
      // multiply by 10^tokenDecimals to get proper token amount
      // BigNumber.div() performs integer division (floors the result)
      const ratio = usdAmount.mul(BigNumber.from(10).pow(tokenDecimals));
      return ratio.div(tokenPrice);
    } catch (error) {
      console.error('Error calculating token amount:', error);
      return BigNumber.from(0);
    }
  }
  
  /**
   * Calculate USD value from token amount and price
   * Uses BigNumber integer division which floors the result
   */
  export function calculateUsdValue(
    tokenAmount: BigNumber,
    tokenPrice: BigNumber,
    tokenDecimals: number = DEFAULT_TOKEN_DECIMALS
  ): BigNumber {
    try {
      if (tokenPrice.isZero()) return BigNumber.from(0);
      
      // tokenAmount (token decimals) * tokenPrice (18 decimals) / 10^tokenDecimals
      // BigNumber.div() performs integer division (floors the result)
      return tokenAmount.mul(tokenPrice).div(BigNumber.from(10).pow(tokenDecimals));
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return BigNumber.from(0);
    }
  }
  
  /**
   * Calculate exchange rate between two tokens
   * Uses BigNumber integer division which floors the result
   */
  export function calculateExchangeRate(
    sourcePrice: BigNumber,
    targetPrice: BigNumber
  ): BigNumber {
    try {
      if (targetPrice.isZero()) return BigNumber.from(0);
      
      // sourcePrice / targetPrice (both 18 decimals) = rate (18 decimals)
      // BigNumber.div() performs integer division (floors the result)
      return sourcePrice.mul(BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS)).div(targetPrice);
    } catch (error) {
      console.error('Error calculating exchange rate:', error);
      return BigNumber.from(0);
    }
  }
  
  /**
   * Validate and sanitize number input
   * Truncates excess decimal places - never rounds
   */
  export function sanitizeNumberInput(input: string): string {
    // Remove any non-numeric characters except decimal point
    let cleaned = input.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Truncate decimal places to 18 (never round)
    const finalParts = cleaned.split('.');
    if (finalParts.length === 2 && finalParts[1].length > 18) {
      cleaned = finalParts[0] + '.' + finalParts[1].substring(0, 18);
    }
    
    return cleaned;
  }