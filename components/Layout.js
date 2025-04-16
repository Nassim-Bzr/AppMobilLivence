// components/Layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from './Navbar';

function LayoutContent({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outerContainer}>
      {/* Zone d'encoche avec fond blanc */}
      <View style={{ backgroundColor: 'white', height: insets.top }} />
      {/* Container principal */}
      <View style={styles.container}>
        {/* Contenu principal */}
        <View style={styles.content}>{children}</View>
        {/* Navbar en bas */}
        <View style={styles.footer}>
          <Navbar />
        </View>
      </View>
    </View>
  );
}

export default function Layout({ children }) {
  return (
    <SafeAreaProvider>
      <LayoutContent>{children}</LayoutContent>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 0,
  },
  footer: {
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    margin: 0,
    padding: 0,
  },
});
