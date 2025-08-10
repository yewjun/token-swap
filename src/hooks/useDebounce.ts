import { useRef, useCallback } from 'react';

/**
 * Hook for debouncing function calls to prevent excessive API requests
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunc = useCallback(
    ((...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    }) as T,
    [func, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedFunc, cancel];
}

/**
 * Hook for immediate debouncing with leading edge execution
 * Executes immediately on first call, then debounces subsequent calls
 */
export function useDebounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);

  const debouncedFunc = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      // If enough time has passed, execute immediately
      if (now - lastCallRef.current > delay) {
        lastCallRef.current = now;
        func(...args);
        return;
      }

      // Otherwise, debounce the call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        func(...args);
      }, delay);
    }) as T,
    [func, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedFunc, cancel];
}