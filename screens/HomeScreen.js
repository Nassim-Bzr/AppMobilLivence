// screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      
      // Votre API URL
      const apiUrl = 'http://192.168.0.54:5000/api/appartements';
      
      console.log(`Tentative de récupération des appartements depuis: ${apiUrl}`);
      
      // Simulons un délai pour montrer l'écran de chargement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Utiliser les données de test directement pour l'instant
      setApartments(mockApartments);
      setError(null);
      setLoading(false);
      
      // Code commenté pour tester avec votre vraie API quand elle sera disponible
      /*
      const response = await fetch(apiUrl, { 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapping des données pour correspondre aux attentes du front-end
      const mappedData = data.map(app => {...});
      
      setApartments(mappedData);
      setError(null);
      */
    } catch (err) {
      console.error(`Erreur:`, err);
      setError(`Erreur de connexion au serveur: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // Filtrage par recherche
  const filteredApartments = apartments.filter(apartment => {
    if (searchQuery.trim() !== '') {
      return (
        apartment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apartment.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleSearch = () => {
    console.log("Recherche:", searchQuery);
  };

  const refreshResults = () => {
    setSearchQuery('');
    fetchApartments();
  };

  // Données de test
  const mockApartments = [
    {
      id: 1,
      image: require('../assets/images/homes.png'),
      title: "Bel appartement en centre-ville",
      location: "Paris, France",
      price: "120€ / nuit"
    },
    {
      id: 2,
      image: require('../assets/images/home.png'),
      title: "Studio moderne avec vue",
      location: "Lyon, France",
      price: "85€ / nuit"
    },
    {
      id: 3,
      image: null,
      title: "Villa avec piscine",
      location: "Marseille, France",
      price: "180€ / nuit"
    }
  ];

  return (
    <View style={styles.container}>
      {/* Bannière d'accueil - Style plus proche de l'image */}
      <ImageBackground 
        source={require('../assets/images/homes.png')} 
        style={styles.banner}
        resizeMode="cover"
      >
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Bienvenue chez Livence</Text>
          <Text style={styles.bannerSubtitle}>
            {isAuthenticated && user ? `Bonjour, ${user.nom}` : "Vous n'êtes pas connecté."}
          </Text>
        </View>
      </ImageBackground>

      {/* Section de contenu blanc */}
      <View style={styles.whiteContent}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par titre ou emplacement..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          <View style={styles.searchButtonsContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={handleSearch}>
              <Text style={styles.filterButtonText}>Filtres</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.refreshButton} onPress={refreshResults}>
              <Text style={styles.refreshButtonText}>Rafraîchir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nombre de logements disponibles */}
        <View style={styles.resultsCountContainer}>
          <Text style={styles.resultsCount}>
            {filteredApartments.length} logement{filteredApartments.length !== 1 ? 's' : ''} disponible{filteredApartments.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Contenu principal */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Chargement des logements...</Text>
            </View>
          ) : error ? (
            <View style={styles.messageContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.mockDataButton} onPress={() => setApartments(mockApartments)}>
                <Text style={styles.mockDataButtonText}>Charger des exemples</Text>
              </TouchableOpacity>
            </View>
          ) : filteredApartments.length === 0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.emptyText}>Aucun appartement à afficher</Text>
            </View>
          ) : (
            <View style={styles.apartmentsList}>
              {filteredApartments.map((item) => (
                <Card
                  key={item.id.toString()}
                  image={item.image}
                  title={item.title}
                  location={item.location}
                  price={item.price}
                  onPress={() => navigation.navigate('Details', { id: item.id })}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  banner: {
    height: height * 0.3, // 30% de la hauteur de l'écran
    width: '100%',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  whiteContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, 
    marginTop: -20,
    paddingTop: 10,
    paddingBottom: 80, // Espace pour la navbar en bas
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#f87171',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsCountContainer: {
    padding: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  apartmentsList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  mockDataButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  mockDataButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
