// screens/DetailsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
  Button,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const API_BASE = 'http://192.168.0.54:5000';
const screenWidth = Dimensions.get('window').width;

export default function DetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [apartment, setApartment] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Pour le carrousel d'images
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Données de test pour l'affichage
  const mockApartmentData = {
    id: 1,
    titre: "Charme & Confort | 4 ch. | Parking + Arrivée 24/7",
    localisation: "Montois-la-Montagne, France",
    prixParNuit: 0, // Gratuit pour le test
    images: [require('../assets/images/homes.png')],
    description: "Charmant appartement de 70m², idéal pour un séjour à Jœuf. Profitez d'un espace confortable avec TV connectée, machine à laver et cuisine équipée (four inclus). Parking gratuit à disposition. Situé à proximité des commerces et bien desservi pour rejoindre Metz, Thionville ou le Luxembourg. Parfait pour voyageurs, professionnels ou familles en quête de tranquillité.",
    surface: 70,
    capacite: ["1 voyageur", "1 chambre", "1 salle de bain"],
    equipements: ["TV connectée", "Machine à laver", "Cuisine équipée", "Four"],
    inclus: ["Parking gratuit", "WiFi", "Draps et serviettes"],
    nonInclus: ["Petit-déjeuner", "Service de ménage quotidien"],
    regles: ["Non-fumeur", "Pas d'animaux", "Pas de fêtes"],
    rating: 5,
    reviewCount: 4,
    smoobuId: "2603523", // ID Smoobu de l'appartement
    smoobuHosteId: "1134658" // ID Smoobu de l'hébergeur
  };

  // Utiliser les données de test pour l'instant
  useEffect(() => {
    // Simuler la récupération des données
    setTimeout(() => {
      setApartment(mockApartmentData);
      setLoadingData(false);
    }, 1000);
    
    // Code commenté pour la vraie API
    /*
    const fetchApartment = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/appartements/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données de l'appartement.");
        }
        const data = await response.json();

        // Parse des images
        let images = data.images;
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images);
          } catch (e) {
            console.error("Erreur parsing images", e);
            images = [];
          }
        }
        data.images = images;

        setApartment(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", error.message);
      } finally {
        setLoadingData(false);
      }
    };
    fetchApartment();
    */
  }, [id]);

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  if (loadingData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E11D48" />
      </View>
    );
  }
  if (!apartment) {
    return (
      <View style={styles.loader}>
        <Text>Appartement non trouvé.</Text>
      </View>
    );
  }

  const images = Array.isArray(apartment.images) ? apartment.images : [];

  const handleBooking = () => {
    setShowBookingForm(true);
  };
  
  // URL directe vers le portail de réservation Smoobu
  const getSmoobuBookingUrl = () => {
    if (!apartment || !apartment.smoobuId) return '';
    
    const hosteId = apartment.smoobuHosteId || '1134658';
    const apartmentId = apartment.smoobuId;
    
    // Utiliser directement l'URL du portail de réservation
    return `https://booking.smoobu.com/9A${hosteId}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Entête avec titre et note */}
        <View style={styles.header}>
          <Text style={styles.title}>{apartment.titre}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name="star" 
                  size={16} 
                  color={star <= (apartment.rating || 5) ? "#FFD700" : "#e0e0e0"} 
                />
              ))}
            </View>
            <Text style={styles.reviewCount}>{apartment.reviewCount || 0} avis</Text>
            <Text style={styles.location}>• {apartment.localisation}</Text>
          </View>
        </View>

        {/* Image principale */}
        <TouchableOpacity onPress={() => openImageModal(0)}>
          <Image
            source={typeof images[0] === 'string' ? { uri: images[0] } : images[0]}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Carte d'infos principale */}
        <View style={styles.mainCard}>
          <Text style={styles.apartmentTitle}>Logement proposé par l'administrateur</Text>
          
          {/* Caractéristiques */}
          <View style={styles.characteristicsContainer}>
            {apartment.capacite && apartment.capacite.map((item, index) => (
              <View key={index} style={styles.characteristicItem}>
                <Ionicons 
                  name={
                    item.includes("voyageur") ? "person-outline" :
                    item.includes("chambre") ? "bed-outline" :
                    "water-outline"
                  } 
                  size={18} 
                  color="#666" 
                />
                <Text style={styles.characteristicText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Section Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{apartment.description}</Text>
          </View>

          {/* Section Caractéristiques */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ce que propose ce logement</Text>
            {apartment.equipements && apartment.equipements.length > 0 ? (
              <View style={styles.amenitiesList}>
                {apartment.equipements.map((item, index) => (
                  <Text key={index} style={styles.amenityItem}>• {item}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noData}>Aucun équipement spécifié</Text>
            )}
          </View>

          {/* Section Avis */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Avis</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllLink}>Voir tous les avis (4) ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewSummary}>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name="star" 
                    size={20} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>5.0 • 4 avis</Text>
            </View>

            <TouchableOpacity style={styles.viewAllCommentsButton}>
              <Text style={styles.viewAllCommentsText}>Voir tous les commentaires</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bandeau de prix et réservation */}
        <View style={styles.priceCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {apartment.prixParNuit === 0 ? "0€" : `${apartment.prixParNuit}€`}
            </Text>
            <Text style={styles.perNight}>/ nuit</Text>
          </View>
          <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
            <Text style={styles.bookingButtonText}>Réserver maintenant</Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire de réservation Smoobu */}
        {showBookingForm && apartment.smoobuId && (
          <View style={styles.bookingFormContainer}>
            <View style={styles.bookingFormHeader}>
              <Text style={styles.bookingFormTitle}>Réserver votre séjour</Text>
              <TouchableOpacity onPress={() => setShowBookingForm(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <WebView
              source={{ uri: getSmoobuBookingUrl() }}
              style={styles.webview}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              renderLoading={() => (
                <View style={styles.webviewLoader}>
                  <ActivityIndicator size="large" color="#E11D48" />
                  <Text style={styles.webviewLoaderText}>Chargement du formulaire de réservation...</Text>
                </View>
              )}
              onError={(e) => {
                console.error('WebView error:', e.nativeEvent);
                Alert.alert(
                  "Erreur",
                  "Impossible de charger le formulaire de réservation. Veuillez réessayer plus tard."
                );
              }}
            />
          </View>
        )}

        {/* Modal pour afficher les images */}
        <Modal
          visible={modalVisible}
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image
              source={typeof images[currentImageIndex] === 'string' 
                ? { uri: images[currentImageIndex] } 
                : images[currentImageIndex]}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  mainImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#ccc',
  },
  mainCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  apartmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  characteristicText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  amenitiesList: {
    flexDirection: 'column',
  },
  amenityItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  noData: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
  },
  seeAllLink: {
    color: '#3B82F6',
    fontSize: 14,
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  viewAllCommentsButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewAllCommentsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  priceCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  perNight: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  bookingButton: {
    backgroundColor: '#E11D48',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  bookingFormContainer: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 500,
  },
  bookingFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookingFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  webview: {
    flex: 1,
    height: '100%',
  },
  webviewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  webviewLoaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

