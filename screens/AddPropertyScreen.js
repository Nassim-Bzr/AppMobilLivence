// screens/AddProperty.js
import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const api = 'http://192.168.0.54:5000';

export default function AddProperty() {
  const navigation = useNavigation();
  const [titre, setTitre] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [prixParNuit, setPrixParNuit] = useState('');
  const [surface, setSurface] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  
  // Nouveaux états
  const [capacite, setCapacite] = useState('');
  const [regles, setRegles] = useState('');
  const [equipements, setEquipements] = useState('');
  const [inclus, setInclus] = useState('');
  const [nonInclus, setNonInclus] = useState('');
  const [hote, setHote] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Permet d'ajouter une URL d'image à la liste
  const addImageUrl = () => {
    if (!currentImageUrl.trim()) {
      Alert.alert('Erreur', "L'URL ne peut pas être vide.");
      return;
    }
    setImages(prev => [...prev, currentImageUrl.trim()]);
    setCurrentImageUrl('');
  };

  const handleAddProperty = async () => {
    // Vérifier que les champs obligatoires sont remplis
    if (!titre || !localisation || !prixParNuit) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Titre, Localisation, Prix par nuit).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titre,
        localisation,
        prixParNuit: parseFloat(prixParNuit),
        surface: surface ? parseInt(surface, 10) : null,
        description,
        // Pour les images, on combine l'URL saisie directement (si renseignée) et la liste des autres images
        images: imageUrl || images.length > 0 ? [imageUrl, ...images].filter(url => url) : null,
        // Pour les champs JSON, on convertit la chaîne en tableau en se basant sur la virgule
        capacite: capacite ? capacite.split(',').map(s => s.trim()) : null,
        regles: regles ? regles.split(',').map(s => s.trim()) : null,
        equipements: equipements ? equipements.split(',').map(s => s.trim()) : null,
        inclus: inclus ? inclus.split(',').map(s => s.trim()) : null,
        nonInclus: nonInclus ? nonInclus.split(',').map(s => s.trim()) : null,
        hote: hote ? hote.trim() : null,
      };

      const response = await fetch(`${api}/api/appartements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Logement ajouté avec succès.');
        navigation.goBack(); // Retour à l'écran précédent
      } else {
        Alert.alert('Erreur', data.message || "Erreur lors de l'ajout du logement.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Erreur lors de la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.previewImage} resizeMode="cover" />
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajouter un logement</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        placeholderTextColor="#000"
        value={titre}
        onChangeText={setTitre}
      />
      <TextInput
        style={styles.input}
        placeholder="Localisation"
        placeholderTextColor="#000"
        value={localisation}
        onChangeText={setLocalisation}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix par nuit"
        placeholderTextColor="#000"
        value={prixParNuit}
        onChangeText={setPrixParNuit}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Surface (en m²)"
        placeholderTextColor="#000"
        value={surface}
        onChangeText={setSurface}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#000"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Champ pour l'URL principale d'une image */}
      <TextInput
        style={styles.input}
        placeholder="URL de l'image principale"
        placeholderTextColor="#000"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      {/* Zone pour ajouter des URLs supplémentaires */}
      <View style={styles.imageInputContainer}>
        <TextInput
          style={[styles.input, styles.imageInput]}
          placeholder="URL d'image supplémentaire"
          placeholderTextColor="#000"
          value={currentImageUrl}
          onChangeText={setCurrentImageUrl}
        />
        <TouchableOpacity style={styles.addButton} onPress={addImageUrl}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Aperçu des images ajoutées */}
      {images.length > 0 && (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesList}
        />
      )}

      {/* Champs supplémentaires */}
      <TextInput
        style={styles.input}
        placeholder="Capacité (séparez par des virgules)"
        placeholderTextColor="#000"
        value={capacite}
        onChangeText={setCapacite}
      />
      <TextInput
        style={styles.input}
        placeholder="Règles (séparez par des virgules)"
        placeholderTextColor="#000"
        value={regles}
        onChangeText={setRegles}
      />
      <TextInput
        style={styles.input}
        placeholder="Équipements (séparez par des virgules)"
        placeholderTextColor="#000"
        value={equipements}
        onChangeText={setEquipements}
      />
      <TextInput
        style={styles.input}
        placeholder="Services inclus (séparez par des virgules)"
        placeholderTextColor="#000"
        value={inclus}
        onChangeText={setInclus}
      />
      <TextInput
        style={styles.input}
        placeholder="Services non inclus (séparez par des virgules)"
        placeholderTextColor="#000"
        value={nonInclus}
        onChangeText={setNonInclus}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom de l'hôte"
        placeholderTextColor="#000"
        value={hote}
        onChangeText={setHote}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAddProperty}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Ajout en cours...' : 'Ajouter le logement'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1fb28a',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1fb28a',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imagesList: {
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#1fb28a',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
