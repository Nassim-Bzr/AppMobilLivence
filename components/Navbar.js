import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.navText}>Accueil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('AddProperty')}
      >
        <Text style={styles.navText}>Propriétaire</Text>
      </TouchableOpacity>

    
      
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('AuthScreen')}
      >
        <Text style={styles.navText}>Connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    height: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
}); 