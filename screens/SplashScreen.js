import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

export default function SplashScreen() {
  return (
    <ImageBackground 
      source={require('../assets/images/homes.png')} 
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.splashContainer}>
     
        <Text style={styles.welcomeText}>Bienvenue sur livence !</Text>
        <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  activityIndicator: {
    marginTop: 20,
  },
});
