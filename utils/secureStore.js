import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const saveToken = async (token) => {
  try {
    console.log("Sauvegarde du token:", token);
    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
    } else {
      await SecureStore.setItemAsync('token', token);
    }
    console.log("Token sauvegardé");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du token", error);
  }
};

export const getToken = async () => {
  try {
    let token;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('token');
    } else {
      token = await SecureStore.getItemAsync('token');
    }
    console.log("Token récupéré:", token);
    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    console.log("Suppression du token");
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
    } else {
      await SecureStore.deleteItemAsync('token');
    }
    console.log("Token supprimé");
  } catch (error) {
    console.error("Erreur lors de la suppression du token", error);
  }
};
