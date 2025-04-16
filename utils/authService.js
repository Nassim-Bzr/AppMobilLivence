import AsyncStorage from '@react-native-async-storage/async-storage';

// Mettez à jour cette adresse IP pour correspondre à celle de votre serveur
// Pour les émulateurs Android, utilisez 10.0.2.2 au lieu de localhost
// Pour les appareils physiques, utilisez l'adresse IP de votre ordinateur sur le réseau local
// const API_BASE = "http://10.0.2.2:5000"; // émulateur Android
const API_BASE = "http://192.168.0.54:5000"; // adresse IP de votre serveur

export const authService = {
  // Enregistrement d'un nouvel utilisateur
  register: async (userData) => {
    console.log('Tentative d\'inscription avec:', JSON.stringify(userData));
    try {
      const url = `${API_BASE}/api/auth/register`;
      console.log('URL d\'inscription:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const responseText = await response.text();
      console.log('Réponse brute du serveur:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erreur lors du parsing de la réponse JSON:', e);
        throw new Error(`Réponse du serveur invalide: ${responseText}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur d\'inscription détaillée:', error);
      throw error;
    }
  },
  
  // Connexion d'un utilisateur existant
  login: async (credentials) => {
    console.log('Tentative de connexion avec:', JSON.stringify(credentials));
    try {
      const url = `${API_BASE}/api/auth/login`;
      console.log('URL de connexion:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const responseText = await response.text();
      console.log('Réponse brute du serveur (login):', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erreur lors du parsing de la réponse JSON (login):', e);
        throw new Error(`Réponse du serveur invalide: ${responseText}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
      
      // Stocker le token et les données utilisateur avec une expiration
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24); // Expire dans 24h
      
      const authData = {
        token: data.token,
        user: data.user,
        expiresAt: expirationDate.toISOString()
      };
      
      await AsyncStorage.setItem('authData', JSON.stringify(authData));
      
      return data;
    } catch (error) {
      console.error('Erreur de connexion détaillée:', error);
      throw error;
    }
  },
  
  // Déconnexion de l'utilisateur
  logout: async () => {
    try {
      // Appel à l'API pour déconnecter l'utilisateur côté serveur
      const token = await AsyncStorage.getItem('userToken');
      
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      // Supprimer les données locales
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      return true;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      
      // Même en cas d'erreur, on supprime les données locales
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      return false;
    }
  },
  
  // Récupération des informations de l'utilisateur connecté
  getCurrentUser: async () => {
    try {
      const authDataStr = await AsyncStorage.getItem('authData');
      if (!authDataStr) return null;
      
      const authData = JSON.parse(authDataStr);
      const expiresAt = new Date(authData.expiresAt);
      const now = new Date();
      
      if (now >= expiresAt) {
        // Token expiré, on nettoie le stockage
        await AsyncStorage.removeItem('authData');
        return null;
      }
      
      return authData.user;
    } catch (error) {
      console.error('Erreur de récupération des données utilisateur:', error);
      return null;
    }
  },
  
  // Vérifie si l'utilisateur est connecté
  isAuthenticated: async () => {
    try {
      const authDataStr = await AsyncStorage.getItem('authData');
      if (!authDataStr) return false;
      
      const authData = JSON.parse(authDataStr);
      const expiresAt = new Date(authData.expiresAt);
      const now = new Date();
      
      if (now >= expiresAt) {
        // Token expiré, on nettoie le stockage
        await AsyncStorage.removeItem('authData');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      return false;
    }
  },
  
  // Récupère le token d'authentification
  getToken: async () => {
    try {
      const authDataStr = await AsyncStorage.getItem('authData');
      if (!authDataStr) return null;
      
      const authData = JSON.parse(authDataStr);
      const expiresAt = new Date(authData.expiresAt);
      const now = new Date();
      
      if (now >= expiresAt) {
        // Token expiré, on nettoie le stockage
        await AsyncStorage.removeItem('authData');
        return null;
      }
      
      return authData.token;
    } catch (error) {
      console.error('Erreur de récupération du token:', error);
      return null;
    }
  },
  
  // Met à jour les données utilisateur en local
  updateUserData: async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Erreur de mise à jour des données utilisateur:', error);
      return false;
    }
  }
}; 