// Debug: Check if environment variables are loaded
if (import.meta.env.DEV) {
  console.log('Environment Variables:', {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Loaded' : '❌ Missing',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing',
  });
}

// Check for required environment variables
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  const errorMessage = 'Missing required environment variables. Please check your .env.local file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

import * as React from 'react';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { ProductsProvider } from './contexts/ProductsContext';
import { ConsultationsProvider } from './contexts/ConsultationsContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { WishlistProvider } from './contexts/WishlistContext';
import App from './App';
import './index.css';
import './utils/checkEnv';

// Error boundary for the app
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
          <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 text-center">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  </div>
);

// Performance monitoring
const startTime = performance.now();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Create root and render the app
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AuthProvider>
            <ProductsProvider>
              <ConsultationsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Suspense fallback={<LoadingFallback />}>
                      <App />
                      <Toaster />
                      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                    </Suspense>
                  </WishlistProvider>
                </CartProvider>
              </ConsultationsProvider>
            </ProductsProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Log performance metrics after initial render
if (import.meta.env.DEV) {
  const endTime = performance.now();
  console.log(`🚀 Application rendered in ${Math.round(endTime - performance.timeOrigin)}ms`);
}