import React, { useState, Suspense } from 'react';
import { ArrowUpDown, Loader2, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { BigNumber } from 'ethers';
import { useMultipleTokenPrices } from '../hooks/useMultipleTokenPrices';
import { useSwapCalculation } from '../hooks/useSwapCalculation';
import { SUPPORTED_TOKENS } from '../lib/tokens';
import { sanitizeNumberInput } from '../lib/bigNumber';
import { Token } from '../types/token';
import { TokenSelector } from './TokenSelector';
import { TokenAmountDisplay } from './TokenAmountDisplay';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

// Lazy load components for better code splitting
const ConversionSummary = React.lazy(() => import('./ConversionSummary'));

export function SwapInterface() {
  // Local state for UI interactions
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [targetToken, setTargetToken] = useState<Token | null>(null);
  const [usdAmountInput, setUsdAmountInput] = useState<string>('');

  // Fetch prices for all supported tokens with React Query
  const { 
    prices, 
    errors,
    isLoading: pricesLoading, 
    error: pricesError,
    refetch: refetchPrices,
    isRefreshing
  } = useMultipleTokenPrices(SUPPORTED_TOKENS);

  // Calculate swap amounts using BigNumber precision
  const swapCalculation = useSwapCalculation({
    sourceToken,
    targetToken,
    sourcePriceBN: sourceToken ? prices[sourceToken.symbol]?.price || BigNumber.from(0) : BigNumber.from(0),
    targetPriceBN: targetToken ? prices[targetToken.symbol]?.price || BigNumber.from(0) : BigNumber.from(0),
    usdAmountInput
  });

  const sourceHasError = sourceToken && errors[sourceToken.symbol];
  const targetHasError = targetToken && errors[targetToken.symbol];
  const hasAnyPricingErrors = Object.keys(errors).length > 0;

  // Event handlers
  const handleUsdAmountChange = (value: string) => {
    const sanitized = sanitizeNumberInput(value);
    setUsdAmountInput(sanitized);
  };

  const handleSwapTokens = () => {
    if (sourceToken && targetToken) {
      const temp = sourceToken;
      setSourceToken(targetToken);
      setTargetToken(temp);
    }
  };

  const handleQuickTokenSelect = (symbol: string) => {
    const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
    if (!token) return;

    if (!sourceToken) {
      setSourceToken(token);
    } else if (!targetToken && token.symbol !== sourceToken.symbol) {
      setTargetToken(token);
    }
  };

  const isCalculating = Boolean(pricesLoading || (!swapCalculation && sourceToken && targetToken && usdAmountInput));

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="space-y-6 pt-6">
          {hasAnyPricingErrors && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2">
              <WifiOff className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-amber-800 font-medium">
                  API Connection Issues
                </p>
                <p className="text-xs text-amber-700">
                  Some token prices unavailable. Check your connection or try again later.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchPrices()}
                  disabled={isRefreshing}
                  className="h-6 text-xs text-amber-800 hover:text-amber-900 p-0"
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry Connection
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Token Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Quick Select</span>
              <div className="flex items-center gap-2">
                {pricesError && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchPrices()}
                    disabled={isRefreshing}
                    className="h-6 text-xs"
                  >
                    {isRefreshing ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Refreshing
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUPPORTED_TOKENS.map((token) => {
                const hasPrice = prices[token.symbol];
                const hasError = errors[token.symbol];
                
                return (
                  <Button
                    key={token.symbol}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTokenSelect(token.symbol)}
                    disabled={pricesLoading || isRefreshing}
                    className="text-xs relative"
                  >
                    {token.symbol}
                    {hasPrice && (
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        ${hasPrice.unitPrice.toFixed(2)}
                      </span>
                    )}
                    {hasError && (
                      <span className="ml-1 text-[10px] text-destructive">-</span>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* USD Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              USD Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                type="text"
                placeholder="Enter amount (e.g., 100.50)"
                value={usdAmountInput}
                onChange={(e) => handleUsdAmountChange(e.target.value)}
                className="pl-8 text-lg font-mono"
                disabled={pricesLoading || isRefreshing}
              />
            </div>
          </div>

          {/* Error Display */}
          {pricesError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-destructive font-medium">
                  Failed to fetch token prices
                </p>
                <p className="text-xs text-destructive/80">
                  Cannot fetch token prices. Please check your connection and try again.
                </p>
              </div>
            </div>
          )}

          {/* Token Selection and Conversion */}
          <div className="space-y-4">
            {/* Source Token */}
            <div className="space-y-3">
              <TokenSelector
                selectedToken={sourceToken}
                onTokenSelect={setSourceToken}
                label="From Token"
                excludeToken={targetToken}
                disabled={pricesLoading || isRefreshing}
              />
              
              {sourceToken && (
                <TokenAmountDisplay
                  token={sourceToken}
                  amount={swapCalculation?.sourceAmount || null}
                  unitPrice={prices[sourceToken.symbol]?.unitPrice || 0}
                  lastUpdated={prices[sourceToken.symbol]?.lastUpdated}
                  isLoading={isCalculating}
                  onRefresh={() => refetchPrices()}
                  hasError={!!sourceHasError}
                  errorMessage={sourceHasError}
                  isRefreshing={isRefreshing}
                />
              )}
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapTokens}
                disabled={!sourceToken || !targetToken || pricesLoading || isRefreshing}
                className="rounded-full hover:rotate-180 transition-transform duration-300"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Target Token */}
            <div className="space-y-3">
              <TokenSelector
                selectedToken={targetToken}
                onTokenSelect={setTargetToken}
                label="To Token"
                excludeToken={sourceToken}
                disabled={pricesLoading || isRefreshing}
              />
              
              {targetToken && (
                <TokenAmountDisplay
                  token={targetToken}
                  amount={swapCalculation?.targetAmount || null}
                  unitPrice={prices[targetToken.symbol]?.unitPrice || 0}
                  lastUpdated={prices[targetToken.symbol]?.lastUpdated}
                  isLoading={isCalculating}
                  onRefresh={() => refetchPrices()}
                  hasError={!!targetHasError}
                  errorMessage={targetHasError}
                  isRefreshing={isRefreshing}
                />
              )}
            </div>
          </div>

          {/* Loading State */}
          {pricesLoading || isRefreshing && (
            <div className="flex items-center justify-center space-x-2 py-6">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {isRefreshing ? 'Refreshing prices...' : 'Fetching real-time prices...'}
              </span>
            </div>
          )}

          {/* Conversion Summary - Lazy Loaded */}
          {swapCalculation && !isCalculating  && !sourceHasError && !targetHasError && (
            <Suspense fallback={
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            }>
              <ConversionSummary calculation={swapCalculation} />
            </Suspense>
          )}

          {/* Calculation Status */}
          {sourceToken && targetToken && usdAmountInput && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                {sourceHasError || targetHasError ? (
                  <div className="flex items-center justify-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    <span className="text-amber-600">Cannot calculate - API pricing unavailable</span>
                  </div>
                ) : isCalculating || isRefreshing ? (
                  <div className="flex items-center justify-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>{isRefreshing ? 'Refreshing...' : 'Calculating...'}</span>
                  </div>
                ) : swapCalculation ? (
                  <span className="text-green-600">✓ Calculation complete</span>
                ) : (
                  <span>Enter USD amount to see conversion</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}