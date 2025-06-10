
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Contexts
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Components
import { MainLayout } from '@/components/Layout/MainLayout';

// Pages
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import Home from '@/pages/Home';
import Calendar from '@/pages/Calendar';
import Notes from '@/pages/Notes';
import Habits from '@/pages/Habits';
import ActionPlan from '@/pages/ActionPlan';
import ReadingList from '@/pages/ReadingList';
import Notebook from '@/pages/Notebook';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { AccentColorProvider } from './contexts/AccentColorContext';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <MainLayout>
            <Home />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/calendar" element={
        <ProtectedRoute>
          <MainLayout>
            <Calendar />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/notes" element={
        <ProtectedRoute>
          <MainLayout>
            <Notes />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/habits" element={
        <ProtectedRoute>
          <MainLayout>
            <Habits />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/action-plan" element={
        <ProtectedRoute>
          <MainLayout>
            <ActionPlan />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reading-list" element={
        <ProtectedRoute>
          <MainLayout>
            <ReadingList />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/notebook" element={
        <ProtectedRoute>
          <MainLayout>
            <Notebook />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccentColorProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </AccentColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
