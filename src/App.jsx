import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { login, logout, setAuthToken } from "@/lib/api";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { token } = await login(credentials);
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {navItems.map(({ to, page: Page }) => (
              <Route
                key={to}
                path={to}
                element={
                  isAuthenticated ? (
                    <Page onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            ))}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;