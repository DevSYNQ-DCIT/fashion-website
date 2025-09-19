// Import React first
import React, { Suspense, lazy } from 'react';

// Then other imports
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Create query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Loading component with better UX
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

// Lazy load components with explicit chunk names for better code splitting
const AdminLayout = lazy(() => import(/* webpackChunkName: "admin" */ "@/components/admin/AdminLayout"));
const Index = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Index"));
const Login = lazy(() => import(/* webpackChunkName: "auth" */ "./pages/Login"));
const Signup = lazy(() => import(/* webpackChunkName: "auth" */ "./pages/Signup"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "auth" */ "./pages/ForgotPassword"));
const ResetPassword = lazy(() => import(/* webpackChunkName: "auth" */ "./pages/ResetPassword"));
const Callback = lazy(() => import(/* webpackChunkName: "auth" */ "./pages/auth/Callback"));
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ "./pages/Cart"));
const Payment = lazy(() => import(/* webpackChunkName: "payment" */ "./pages/Payment"));
const TestConnection = lazy(() => import(/* webpackChunkName: "test-connection" */ "./pages/TestConnection"));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ "./pages/Dashboard"));
const CheckoutPage = lazy(() => import(/* webpackChunkName: "checkout" */ "@/pages/checkout/CheckoutPage"));
const OrderConfirmation = lazy(() => import(/* webpackChunkName: "order" */ "@/pages/OrderConfirmation"));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "./pages/NotFound"));
const AdminDashboard = lazy(() => import(/* webpackChunkName: "admin-dashboard" */ "@/pages/admin/DashboardPage"));
const AnalyticsPage = lazy(() => import(/* webpackChunkName: "admin-analytics" */ "@/pages/admin/AnalyticsPage"));
const UsersPage = lazy(() => import(/* webpackChunkName: "admin-users" */ "@/pages/admin/UsersPage"));
const ProductsPage = lazy(() => import(/* webpackChunkName: "admin-products" */ "@/pages/admin/ProductsPage"));
const OrdersPage = lazy(() => import(/* webpackChunkName: "admin-orders" */ "@/pages/admin/OrdersPage"));
const SettingsPage = lazy(() => import(/* webpackChunkName: "admin-settings" */ "@/pages/admin/SettingsPage"));
const ConsultationsPage = lazy(() => import(/* webpackChunkName: "admin-consultations" */ "@/pages/admin/ConsultationsPage"));
const ConsultationDetailPage = lazy(() => import(/* webpackChunkName: "admin-consultation-detail" */ "@/pages/admin/ConsultationDetailPage"));

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/auth/callback",
    element: <Callback />,
  },
  {
    path: "/test-connection",
    element: <TestConnection />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmation />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "consultations", element: <ConsultationsPage /> },
      { path: "consultations/:id", element: <ConsultationDetailPage /> },
    ].map(route => ({
      ...route,
      element: <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>,
    })),
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_throwAbortReason: true,
  },
});

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Suspense fallback={<LoadingFallback />}>
                <RouterProvider router={router} />
              </Suspense>
              <Toaster />
              <Sonner position="top-center" />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
