import { useCallback, useState } from 'react';
import { BigNumber } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import { Token } from '../types/token';
import { fetchMultipleTokenPrices } from '../lib/api';
import { useDebounceImmediate } from './useDebounce';

interface MultipleTokenPricesResult {
  prices: Record<string, { price: BigNumber; unitPrice: number; lastUpdated: Date }>;
  errors: Record<string, string>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isRefreshing: boolean;
}

/**
 * Hook to fetch multiple token prices efficiently
 */
export function useMultipleTokenPrices(tokens: Token[]): MultipleTokenPricesResult {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = useQuery({
    queryKey: ['multipleTokenPrices', tokens.map(t => `${t.symbol}-${t.chainId}`).join(',')],
    queryFn: () => fetchMultipleTokenPrices(tokens),
    enabled: tokens.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
    retry: 2 // Reduce retries since we handle errors gracefully
  });

  // Handle refresh loading state
  const handleRefetch = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await query.refetch();
    } finally {
      // Add minimum delay to show feedback to user
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [query]);

  // Debounce refresh calls to prevent spam clicking
  // Use immediate execution with 2-second debounce for subsequent calls
  const [debouncedRefetch] = useDebounceImmediate(handleRefetch, 2000);
  
  return {
    prices: query.data?.prices || {},
    errors: query.data?.errors || {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: debouncedRefetch,
    isRefreshing
  };
}