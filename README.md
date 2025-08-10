# Token Swap Interface

A React application showcasing advanced cryptocurrency token exploration with high-precision calculations and optimized performance.

[**Live Application**](https://token-swap-git-main-yewjuns-projects.vercel.app/)

## ✨ Features

### **💯 Financial Calculations**
- **BigNumber Integration**: All monetary calculations use ethers.js BigNumber with 18 decimal precision to prevent floating-point errors
- **Truncation Strategy**: Financial calculations always truncate (floor) rather than round to ensure conservative estimates
- **Multi-Token Support**: Real-time price fetching for USDC, USDT, ETH, and WBTC across different chains

### **⚡ Performance Optimizations**
- **Code Splitting**: Strategic lazy loading with React.lazy() and Suspense boundaries
- **Bundle Optimization**: Separate chunks for React, Ethers.js, and UI components using Rsbuild
- **Intelligent Caching**: React Query with 5-minute stale time and 30-second background refetch
- **Debounced API Calls**: Prevents excessive API requests with immediate execution + debouncing

### **🔄 Data Management**
- **React Query Integration**: Comprehensive query management with automatic retries and background sync
- **Error Boundaries**: Graceful handling of API failures with user-friendly error messages
- **Real-time Updates**: Automatic price refreshing every 30 seconds with manual refresh capability
- **Optimistic Loading States**: Smooth UX with skeleton states and loading indicators

### **🎯 Architecture**
- **TypeScript Strict Mode**: Full type safety with comprehensive interfaces
- **Component Composition**: Reusable UI components with shadcn/ui design system
- **Environment Configuration**: Secure API key management with Rsbuild DefinePlugin
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack & Design Decisions

### **Core Framework & Build Tools**
- **React 18** with TypeScript for type safety and modern React features
- **Rsbuild** (Rust-based bundler) - Chosen over Webpack for 5-10x faster builds and superior performance
- **Vite-style environment variables** for seamless development experience

### **Financial Precision Libraries**
- **ethers.js v5** - Industry standard for blockchain interactions and BigNumber calculations
- **@funkit/api-base** - Professional crypto API with multi-chain support

### **State & Data Management**
- **@tanstack/react-query v5** - Server state management with intelligent caching
  - Background refetching every 30 seconds
  - 5-minute stale time with 10-minute garbage collection
  - Automatic retry logic with exponential backoff
- **React built-in state** for UI interactions (no unnecessary state management overhead)

### **UI & Styling**
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **shadcn/ui components** - Production-ready, accessible components
- **Radix UI primitives** - Unstyled, accessible components as foundation
- **Lucide React** - Modern icon library with consistent design

### **Key Design Choices**

#### **1. BigNumber-First Financial Architecture**
```typescript
// All financial calculations use BigNumber to prevent precision loss
const tokenAmount = calculateTokenAmount(usdAmount, tokenPrice, tokenDecimals);
const exchangeRate = calculateExchangeRate(sourcePriceBN, targetPriceBN);
```

#### **2. Conservative Financial Calculations**
All calculations use truncation (floor) rather than rounding to ensure users never receive more tokens than mathematically possible, following financial industry best practices.

#### **3. Modular Component Architecture**
```typescript
// Lazy loading for optimal performance
const ConversionSummary = React.lazy(() => import('./ConversionSummary'));
const SwapInterface = React.lazy(() => import('./components/SwapInterface'));
```

#### **4. Robust Error Handling**
Individual token price failures don't break the entire interface - users can still interact with available tokens while problematic ones show clear error states.

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ (recommended: Node.js 18+)
- npm or yarn package manager

### **Environment Setup**
1. **Clone the repository**
   ```bash
   git clone git@github.com:yewjun/token-swap-interface.git
   cd token-swap-interface
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local and add your Funkit API key
   VITE_FUNKIT_API_KEY=Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### **Production Build**
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### **Build Analysis**
```bash
# Analyze bundle size and composition
npm run build -- --analyze
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── SwapInterface.tsx
│   ├── TokenSelector.tsx
│   └── ConversionSummary.tsx
├── hooks/              # Custom React hooks
│   ├── useMultipleTokenPrices.ts
│   ├── useSwapCalculation.ts
│   └── useDebounce.ts
├── lib/                # Utility functions and configurations
│   ├── api.ts          # Funkit API integration
│   ├── bigNumber.ts    # Financial calculation utilities
│   ├── tokens.ts       # Supported token definitions
│   └── utils.ts        # General utilities
├── types/              # TypeScript type definitions
│   └── token.ts
└── App.tsx            # Main application (header, swap interface, footer)
└── main.tsx           # Application entry point
```

## 💡 Key Implementation Insights

### **Financial Calculation Philosophy**
The application prioritizes financial accuracy over convenience:
- **BigNumber Everywhere**: No floating-point arithmetic for monetary values
- **Truncation Over Rounding**: Conservative estimates protect users from calculation errors
- **18-Decimal Precision**: Industry-standard precision for DeFi applications

### **Performance Optimization Strategy**
1. **Bundle Splitting**: Separate chunks for React (~45KB), Ethers.js (~180KB), and UI components (~25KB)
2. **Lazy Loading**: Components load on-demand to reduce initial bundle size
3. **Intelligent Caching**: React Query prevents unnecessary API calls while keeping data fresh

### **User Experience Focus**
- **Progressive Loading**: Users see immediate feedback with skeleton states
- **Error Resilience**: Individual token failures don't break the entire interface
- **Real-time Updates**: Prices update automatically with manual refresh option
- **Mobile Responsive**: Fully functional across all device sizes

## 🔧 API Integration

### **Funkit API Configuration**
The application integrates with Funkit's professional cryptocurrency API:

```typescript
// Multi-token price fetching with error handling
const { prices, errors, isLoading, refetch } = useMultipleTokenPrices(SUPPORTED_TOKENS);

// Individual token price fetching
const priceData = await fetchTokenPrice(token);
```

### **Supported Tokens**
- **USDC** (Ethereum mainnet) - 6 decimals
- **USDT** (Polygon) - 6 decimals  
- **ETH** (Base chain) - 18 decimals
- **WBTC** (Ethereum mainnet) - 8 decimals

## 🧪 Development Features

### **React Query DevTools**
Development builds include React Query DevTools for debugging:
- Query state inspection
- Cache invalidation testing
- Network request monitoring

### **TypeScript Integration**
- Strict mode enabled for maximum type safety
- Comprehensive interfaces for all data structures
- Build-time type checking with rsbuild plugin

### **Hot Module Replacement**
Lightning-fast development with Rsbuild's optimized HMR.

## 🚀 Deployment

### **Vercel Deployment**
The application is optimized for Vercel deployment.

### **Environment Variables**
Set `VITE_FUNKIT_API_KEY` in your deployment platform's environment configuration.