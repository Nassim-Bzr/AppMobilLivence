// components/Menu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
  const navigation = useNavigation();

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.menuText}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.menuText}>Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.menuText}>Paramètres</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 60,
    backgroundColor: '#1fb28a',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});
