import React, { useState, useEffect } from 'react';
import { Token, TokenAmount } from '../types/token';
import { Loader2, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { formatRelativeTime, formatExactTime } from '../lib/utils';

interface TokenAmountDisplayProps {
  token: Token;
  amount: TokenAmount | null;
  unitPrice: number;
  lastUpdated?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
  hasError?: boolean;
  errorMessage?: string | null;
  isRefreshing?: boolean;
}

export function TokenAmountDisplay({ 
  token, 
  amount, 
  unitPrice,
  lastUpdated,
  isLoading = false,
  onRefresh,
  hasError = false,
  errorMessage,
  isRefreshing = false 
}: TokenAmountDisplayProps) {
  const [showExactTime, setShowExactTime] = useState(false);
  const [relativeTime, setRelativeTime] = useState<string>('');

  // Update relative time every second
  useEffect(() => {
    if (!lastUpdated) return;

    const updateRelativeTime = () => {
      setRelativeTime(formatRelativeTime(lastUpdated));
    };

    updateRelativeTime(); // Initial update
    const interval = setInterval(updateRelativeTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Show loading state for either main loading or refresh loading
  const showLoading = isLoading || isRefreshing;

  return (
    <div className={`bg-muted/50 rounded-lg p-3 sm:p-4 space-y-3 ${hasError ? 'border border-destructive/20' : ''}`}>
      {/* Header with token info and refresh button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm sm:text-base font-semibold">{token.symbol}</span>
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              ({token.name})
            </span>
            {hasError && <AlertCircle className="h-3 w-3 text-destructive" />}
          </div>
        </div>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={showLoading}
            className="h-6 w-6 p-0 flex-shrink-0"
            title={isRefreshing ? 'Refreshing...' : 'Refresh prices'}
          >
            {showLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
      
      {/* Amount and values */}
      <div className="space-y-2 sm:space-y-3">
        {/* Amount row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Amount</span>
          <div className="text-left sm:text-right">
            {showLoading ? (
              <div className="flex items-center space-x-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-sm">{isRefreshing ? 'Refreshing...' : 'Calculating...'}</span>
              </div>
            ) : hasError ? (
              <span className="font-mono text-lg text-destructive">-</span>
            ) : (
              <span className="font-mono text-base sm:text-lg font-semibold break-all">
                {amount?.formatted || '0'}
              </span>
            )}
          </div>
        </div>
        
        {/* Price row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Price</span>
          <span className="text-sm sm:text-base font-medium break-all">
          {hasError ? (
              <span className="text-destructive">-</span>
            ) : (
              `${unitPrice.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 6 
              })}`
          )}
          </span>
        </div>
        
        {/* USD Value row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">USD Value</span>
          <span className="text-sm sm:text-base font-medium break-all">
            {hasError ? (
                <span className="text-destructive">-</span>
              ) : (
                `${amount?.usdFormatted || '0'}`
            )}
          </span>
        </div>
      </div>
      
      {/* Footer with chain info and timestamp */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Chain info */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-center sm:text-left">
            <span>Chain ID: {token.chainId}</span>
            <span className="hidden sm:inline">•</span>
            <span>Decimals: {token.decimals}</span>
          </div>
          
          {/* Last updated timestamp */}
          {lastUpdated && (
            <div 
              className="flex items-center gap-1 text-center sm:text-right cursor-pointer hover:text-foreground transition-colors"
              onClick={() => setShowExactTime(!showExactTime)}
              title={showExactTime ? relativeTime : formatExactTime(lastUpdated)}
            >
              <Clock className="h-3 w-3" />
              <span>
                {showExactTime ? formatExactTime(lastUpdated) : relativeTime}
              </span>
            </div>
          )}
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="text-xs text-destructive bg-destructive/10 rounded p-2 mt-2">
          {errorMessage}
        </div>
      )}
    </div>
  );
}