import React from 'react';
import { Token } from '../types/token';
import { SUPPORTED_TOKENS } from '../lib/tokens';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  label: string;
  excludeToken?: Token | null;
  disabled?: boolean;
}

export function TokenSelector({ 
  selectedToken, 
  onTokenSelect, 
  label, 
  excludeToken,
  disabled = false
}: TokenSelectorProps) {
  const availableTokens = SUPPORTED_TOKENS.filter(
    token => !excludeToken || token.symbol !== excludeToken.symbol
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Select
        value={selectedToken?.symbol || ''}
        onValueChange={(value) => {
          const token = SUPPORTED_TOKENS.find(t => t.symbol === value);
          if (token) onTokenSelect(token);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a token">
            {selectedToken && (
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-semibold">{selectedToken.symbol}</span>
                <span className="text-muted-foreground text-xs">({selectedToken.name})</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableTokens.map((token) => (
            <SelectItem key={`${token.symbol}-${token.chainId}`} value={token.symbol}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-semibold">{token.symbol}</span>
                  <span className="text-muted-foreground text-xs">({token.name})</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Chain: {token.chainId}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}