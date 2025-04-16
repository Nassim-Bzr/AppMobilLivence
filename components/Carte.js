// components/Carte.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Modal, TouchableOpacity, FlatList, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.54:5000/api/appartements';
const { width } = Dimensions.get('window');

export default function Carte({ onClose }) {
  const navigation = useNavigation();
  const [groupedAppartements, setGroupedAppartements] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const cacheRef = useRef({});

  const geocodeCity = async (city) => {
    if (cacheRef.current[city]) return cacheRef.current[city];
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        cacheRef.current[city] = coords;
        return coords;
      }
    } catch (err) {
      console.error('Erreur de géocodage:', err);
    }
    return null;
  };

  useEffect(() => {
    let isMounted = true;
  
    const loadAppartements = async () => {
      try {
        const response = await fetch(API_URL);
        const appartements = await response.json();
  
        const groups = {};
        for (const app of appartements) {
          if (!isMounted) break;
  
          let coords = null;
          if (app.latitude && app.longitude) {
            coords = { latitude: app.latitude, longitude: app.longitude };
          } else {
            coords = await geocodeCity(app.localisation || '');
          }
  
          let images = app.images;
          if (typeof images === 'string') {
            try {
              images = JSON.parse(images);
            } catch (e) {
              images = [];
            }
          }
  
          if (coords) {
            const key = `${coords.latitude.toFixed(4)}-${coords.longitude.toFixed(4)}`;
            if (!groups[key]) {
              groups[key] = { coords, apps: [] };
            }
            groups[key].apps.push({
              ...app,
              images: images && images.length > 0 ? images : [],
            });
  
            // MàJ progressive si souhaité :
            if (isMounted) {
              setGroupedAppartements((prev) => ({ ...prev, [key]: groups[key] }));
            }
          }
        }
      } catch (err) {
        console.error('Erreur fetch appartements:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    loadAppartements();
  
    return () => {
      isMounted = false;
    };
  }, []);
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1fb28a" />
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  const firstGroup = Object.values(groupedAppartements)[0];
  const initialRegion = firstGroup ? {
    latitude: firstGroup.coords.latitude,
    longitude: firstGroup.coords.longitude,
    latitudeDelta: 2,
    longitudeDelta: 2,
  } : {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        {Object.values(groupedAppartements).map((group, index) => {
          const mostRecent = group.apps[group.apps.length - 1];
          const imageUrl = mostRecent.images && mostRecent.images.length > 0 ? mostRecent.images[0] : 'https://via.placeholder.com/240x120';
          return (
            <Marker key={index} coordinate={group.coords}>
              <View style={styles.markerBadge}>
                <Text style={styles.markerText}>{group.apps.length}</Text>
              </View>
              <Callout
                tooltip={true}
                onPress={() => {
                  if (group.apps.length === 1) {
                    if (onClose) onClose();
                    navigation.navigate('Details', { id: mostRecent.id });
                  } else {
                    setSelectedGroup(group.apps);
                    setModalVisible(true);
                  }
                }}
              >
                <View style={styles.calloutWrapper}>
                  <View style={[styles.calloutArrow, { borderBottomColor: '#fff' }]} />
                  <View style={styles.calloutContainer}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.calloutImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.calloutTitle} numberOfLines={1} ellipsizeMode="tail">
                      {mostRecent.titre}
                    </Text>
                    <Text style={styles.calloutPrice}>{mostRecent.prixParNuit} € / nuit</Text>
                    {group.apps.length > 1 && (
                      <Text style={styles.calloutMore}>+ {group.apps.length - 1} autres →</Text>
                    )}
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrapper}>
          <Text style={styles.modalTitle}>Appartements à cet endroit</Text>
          <FlatList
            data={selectedGroup}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  if (onClose) onClose();
                  navigation.navigate('Details', { id: item.id });
                }}
                style={styles.listItem}
              >
                <Image
                  source={{ uri: item.images?.[0] || 'https://via.placeholder.com/120x80' }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.titre}</Text>
                  <Text>{item.prixParNuit} € / nuit</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  markerBadge: {
    backgroundColor: '#1fb28a',
    borderRadius: 15,
    padding: 6,
    borderColor: '#fff',
    borderWidth: 2,
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calloutWrapper: {
    alignItems: 'center',
  },
  calloutArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: -1,
  },
  calloutContainer: {
    width: 250,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  calloutPrice: {
    fontSize: 14,
    marginTop: 2,
    color: '#555',
    textAlign: 'center',
  },
  calloutMore: {
    color: 'lightblue',
    marginTop: 4,
    textAlign: 'center'
  },
  modalWrapper: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: width - 40,
    alignSelf: 'center',
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#d9534f',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
});
