import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../utils/authService';

// Création du contexte
const AuthContext = createContext(null);

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      const userData = await authService.getCurrentUser();
      
      setIsAuthenticated(isAuth);
      if (isAuth && userData) {
        setUser(userData);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'authentification:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response && response.user && response.token) {
        setIsAuthenticated(true);
        setUser(response.user);
        // Force une mise à jour du state
        await checkAuthStatus();
        return response;
      } else {
        throw new Error('Données de connexion invalides');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // On force quand même la déconnexion côté client
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        return response;
      } else {
        throw new Error('Données d\'inscription invalides');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const value = {
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; 