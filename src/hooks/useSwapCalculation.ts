import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import { Token, SwapCalculation, TokenAmount } from '../types/token';
import { 
  calculateTokenAmount, 
  calculateExchangeRate, 
  formatBigNumber,
  parseToBigNumber,
  USD_DECIMALS,
  DEFAULT_TOKEN_DECIMALS
} from '../lib/bigNumber';

interface UseSwapCalculationProps {
  sourceToken: Token | null;
  targetToken: Token | null;
  sourcePriceBN: BigNumber;
  targetPriceBN: BigNumber;
  usdAmountInput: string;
}

/**
 * Hook to calculate swap amounts with BigNumber precision
 */
export function useSwapCalculation({
  sourceToken,
  targetToken,
  sourcePriceBN,
  targetPriceBN,
  usdAmountInput
}: UseSwapCalculationProps): SwapCalculation | null {
  
  return useMemo(() => {
    if (!sourceToken || !targetToken || !usdAmountInput) {
      return null;
    }
    
    const usdAmount = parseToBigNumber(usdAmountInput, USD_DECIMALS);
    
    if (usdAmount.isZero() || sourcePriceBN.isZero() || targetPriceBN.isZero()) {
      return null;
    }
    
    // Calculate source token amount
    const sourceAmountRaw = calculateTokenAmount(parseToBigNumber(usdAmountInput, DEFAULT_TOKEN_DECIMALS), sourcePriceBN, sourceToken.decimals);
    const sourceAmount: TokenAmount = {
      raw: sourceAmountRaw,
      formatted: formatBigNumber(sourceAmountRaw, sourceToken.decimals, 6),
      usd: usdAmount,
      usdFormatted: formatBigNumber(usdAmount, USD_DECIMALS, 2)
    };
    
    // Calculate target token amount
    const targetAmountRaw = calculateTokenAmount(parseToBigNumber(usdAmountInput, DEFAULT_TOKEN_DECIMALS), targetPriceBN, targetToken.decimals);
    const targetAmount: TokenAmount = {
      raw: targetAmountRaw,
      formatted: formatBigNumber(targetAmountRaw, targetToken.decimals, 6),
      usd: usdAmount,
      usdFormatted: formatBigNumber(usdAmount, USD_DECIMALS, 2)
    };
    
    // Calculate exchange rate (how many target tokens per source token)
    const exchangeRate = calculateExchangeRate(sourcePriceBN, targetPriceBN);
    
    return {
      sourceToken,
      targetToken,
      usdAmount,
      sourceAmount,
      targetAmount,
      exchangeRate,
    };
  }, [sourceToken, targetToken, sourcePriceBN, targetPriceBN, usdAmountInput]);
}