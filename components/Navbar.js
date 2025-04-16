import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigation = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home-outline" size={22} color="#3B82F6" />
        <Text style={styles.navText}>Accueil</Text>
      </TouchableOpacity>
      
      {isAuthenticated ? (
        <>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AddProperty')}
          >
            <Ionicons name="add-circle-outline" size={22} color="#3B82F6" />
            <Text style={styles.navText}>Propriétaire</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={22} color="#3B82F6" />
            <Text style={styles.navText}>Profil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#3B82F6" />
            <Text style={styles.navText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('AuthScreen')}
        >
          <Ionicons name="log-in-outline" size={22} color="#3B82F6" />
          <Text style={styles.navText}>Connexion</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    height: 75,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5, // ombre sur Android
    shadowColor: '#000', // ombre sur iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    height: '100%',
    marginHorizontal: 8,
    paddingBottom: 15,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginTop: 4,
  },
}); 