// components/Filter.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  Pressable
} from 'react-native';
import Carte from './Carte';
import RangeSlider from 'rn-range-slider';
import {
  renderThumb,
  renderRail,
  renderRailSelected,
  renderNotch,
  renderLabel
} from './SliderRenders'; // Assure-toi d’avoir ce fichier

const { width } = Dimensions.get('window');
const initialPriceRange = [0, 5000];

export default function Filter({ appartements, onNavigateToDetails, onApplyFilters }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [lowValue, setLowValue] = useState(initialPriceRange[0]);
  const [highValue, setHighValue] = useState(initialPriceRange[1]);

  const handleApply = () => {
    setPriceRange([lowValue, highValue]);
    onApplyFilters({ priceRange: [lowValue, highValue] });
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.filterButtonText}>Carte</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.topHalf}>
            <Carte
              appartements={appartements}
              priceRange={[lowValue, highValue]}
              onSelect={(id) => {
                setModalVisible(false);
                onNavigateToDetails(id);
              }}
            />
          </View>

          <View style={styles.bottomHalf}>
            <Text style={styles.label}>Fourchette de prix</Text>
            <RangeSlider
              style={styles.slider}
              min={0}
              max={5000}
              step={50}
              low={lowValue}
              high={highValue}
              onValueChanged={(low, high) => {
                setLowValue(low);
                setHighValue(high);
              }}
              renderThumb={renderThumb}
              renderRail={renderRail}
              renderRailSelected={renderRailSelected}
              renderNotch={renderNotch}
              renderLabel={renderLabel}
            />
            <Text style={styles.rangeText}>{lowValue}€ - {highValue}€</Text>

            <View style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Fermer</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonApply]} onPress={handleApply}>
                <Text style={styles.buttonText}>Appliquer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    width,
  },
  filterButton: {
    backgroundColor: '#1fb28a',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
  },
  bottomHalf: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: width - 60,
    marginVertical: 20,
  },
  rangeText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#1fb28a',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonApply: {
    backgroundColor: '#0a7f5f',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
