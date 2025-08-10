import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the swap interface to reduce initial bundle size
const SwapInterface = React.lazy(() => 
  import('./components/SwapInterface').then(module => ({
    default: module.SwapInterface
  }))
);

// Loading fallback component
const AppLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      <p className="text-muted-foreground">Loading Token Swap...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<AppLoader />}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Token Swap
              </h1>
            </div>

            {/* Main Interface */}
            <Suspense fallback={<AppLoader />}>
              <SwapInterface />
            </Suspense>

            {/* Technical Details */}
            <div className="mt-8 text-center space-y-2">
              <div className="text-xs text-muted-foreground">
                Powered by Funkit API • Auto-refresh every 30s
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default App;