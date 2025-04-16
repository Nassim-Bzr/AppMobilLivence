// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingScreen';
import Profile from './screens/ProfileScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import AddProperty from './screens/AddPropertyScreen';
import AuthScreen from './screens/AuthScreen';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

// Navigation principale
function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Affiche le SplashScreen pendant 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Si le splash screen est en cours ou que l'authentification est en cours de vérification
  if (isLoading || loading) {
    return <SplashScreen />;
  }

  return (
    <Layout>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Reservations" component={ReservationsScreen} />
        <Stack.Screen name="AddProperty" component={AddProperty} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
      </Stack.Navigator>
    </Layout>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
