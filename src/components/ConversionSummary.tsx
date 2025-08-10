import React from 'react';
import { ArrowRight, TrendingUp, Calculator } from 'lucide-react';
import { SwapCalculation } from '../types/token';
import { DEFAULT_TOKEN_DECIMALS, formatBigNumber, USD_DECIMALS } from '../lib/bigNumber';

interface ConversionSummaryProps {
  calculation: SwapCalculation;
}

const ConversionSummary: React.FC<ConversionSummaryProps> = ({ calculation }) => {
  const {
    sourceToken,
    targetToken,
    usdAmount,
    sourceAmount,
    targetAmount,
    exchangeRate
  } = calculation;

 const exchangeRateFormatted = formatBigNumber(exchangeRate, DEFAULT_TOKEN_DECIMALS, targetToken.decimals);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Calculator className="h-4 w-4 text-primary" />
        <h4 className="font-medium text-sm">Conversion Summary</h4>
      </div>
      
      <div className="space-y-3">
        {/* USD to Source Token */}
        <div className="flex items-center justify-between p-2 bg-background/50 rounded-md">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              ${formatBigNumber(usdAmount, USD_DECIMALS, 2)} USD
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-mono">
              {sourceAmount.formatted} {sourceToken.symbol}
            </span>
          </div>
        </div>

        {/* USD to Target Token */}
        <div className="flex items-center justify-between p-2 bg-background/50 rounded-md">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              ${formatBigNumber(usdAmount, USD_DECIMALS, 2)} USD
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-mono">
              {targetAmount.formatted} {targetToken.symbol}
            </span>
          </div>
        </div>

        {/* Exchange Rate */}
        {sourceToken.symbol !== targetToken.symbol && (
          <div className="pt-3 border-t border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Exchange Rate</span>
              </div>
              <span className="text-sm font-mono">
                1 {sourceToken.symbol} ≈ {exchangeRateFormatted} {targetToken.symbol}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionSummary;