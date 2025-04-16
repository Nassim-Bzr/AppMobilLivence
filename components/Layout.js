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
        <View style={[styles.content, { paddingBottom: 75 }]}>
          {children}
        </View>
        {/* La Navbar est maintenant en position absolue, donc pas besoin de View container */}
        <Navbar />
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
    position: 'relative',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
