
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Home from '@/pages/Home';
import Calendar from '@/pages/Calendar';
import Notes from '@/pages/Notes';
import Habits from '@/pages/Habits';
import ActionPlan from '@/pages/ActionPlan';
import ReadingList from '@/pages/ReadingList';
import Notebook from '@/pages/Notebook';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
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
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
