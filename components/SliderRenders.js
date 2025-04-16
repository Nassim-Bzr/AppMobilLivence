// components/SliderRenders.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const renderThumb = () => <View style={styles.thumb} />;
export const renderRail = () => <View style={styles.rail} />;
export const renderRailSelected = () => <View style={styles.railSelected} />;
export const renderNotch = () => <View style={styles.notch} />;
export const renderLabel = (value) => (
  <View style={styles.labelWrapper}><Text style={styles.labelText}>{value}€</Text></View>
);

const styles = StyleSheet.create({
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#1fb28a',
    borderRadius: 10,
  },
  rail: {
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  railSelected: {
    height: 4,
    backgroundColor: '#1fb28a',
    borderRadius: 2,
  },
  notch: {
    width: 10,
    height: 10,
    backgroundColor: '#1fb28a',
    borderRadius: 5,
  },
  labelWrapper: {
    backgroundColor: '#1fb28a',
    padding: 4,
    borderRadius: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
  },
});
