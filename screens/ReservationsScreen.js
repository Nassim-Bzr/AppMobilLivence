// screens/ReservationsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  SectionList, 
  StyleSheet, 
  Image 
} from 'react-native';

const api = 'http://192.168.0.54:5000';

export default function ReservationsScreen() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${api}/reservations/user`);
        const reservations = await response.json();

        // Tri et regroupement des réservations en fonction de la date actuelle
        const now = new Date();
        const upcoming = [];
        const inProgress = [];
        const past = [];

        reservations.forEach((res) => {
          const arrival = new Date(res.startDate);
          const departure = new Date(res.endDate);
          if (now < arrival) {
            upcoming.push(res);
          } else if (now >= arrival && now <= departure) {
            inProgress.push(res);
          } else {
            past.push(res);
          }
        });

        setSections([
          { title: 'À venir', data: upcoming },
          { title: 'En cours', data: inProgress },
          { title: 'Passées', data: past },
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations :', error);
      }
    };

    fetchReservations();
  }, []);

  const renderReservationItem = ({ item }) => {
    let imageSource = null;

    // 1. Vérifier si l'appartement existe
    if (item.appartement) {
      let images = item.appartement.images;

      // 2. Si c'est une chaîne, on la parse
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch (e) {
          console.error("Erreur lors du parsing des images :", e);
          images = [];
        }
      }

      // 3. Prendre la première image du tableau comme image principale
      if (Array.isArray(images) && images.length > 0) {
        imageSource = images[0];
      } else if (typeof images === 'string') {
        // Si jamais c'est juste une URL en string (non-JSON)
        imageSource = images;
      }
    }

    // 4. Vérification basique pour l'URI
    const isValidUri =
      imageSource &&
      typeof imageSource === 'string' &&
      (imageSource.startsWith('http') || imageSource.startsWith('data:image/'));

    return (
      <View style={styles.reservationItem}>
        {isValidUri ? (
          <Image 
            source={{ uri: imageSource }}
            style={styles.reservationImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.reservationImage, { backgroundColor: '#ccc' }]} />
        )}
        <View style={styles.reservationInfo}>
          <Text style={styles.reservationTitle}>
            {item.appartement ? item.appartement.titre : 'Logement inconnu'}
          </Text>
          <Text style={styles.reservationDetails}>
            Du {new Date(item.startDate).toLocaleDateString()} au {new Date(item.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.reservationDetails}>
            Total: {item.totalPrice} €
          </Text>
          <Text style={styles.reservationDetails}>
            Réservé le: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mes Réservations</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderReservationItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune réservation enregistrée.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#1fb28a',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  reservationItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  reservationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  reservationInfo: {
    flex: 1,
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  reservationDetails: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
});
