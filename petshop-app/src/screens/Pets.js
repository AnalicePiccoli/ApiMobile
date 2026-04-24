import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { Colors } from '../styles/colors';
import ScreenHeader from '../components/ScreenHeader';

function PetCard({ pet, navigation }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.petName}>{pet.nome}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterPet', { petId: pet._id })}>
          <Ionicons name="create-outline" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.petContent}>
        <View style={styles.petAvatar}>
          <Ionicons name="paw" size={34} color={Colors.secondary} />
        </View>
        <View style={styles.petInfo}>
          <Text style={styles.petInfoText}>Idade: {pet.idade ?? '-'}</Text>
          <Text style={styles.petInfoText}>Raca: {pet.raca || '-'}</Text>
          <Text style={styles.petInfoText}>Peso: {pet.peso ?? '-'}</Text>
          <Text style={styles.petInfoText}>Porte: {pet.porte || '-'}</Text>
          <Text style={styles.petInfoText}>Alergias: {pet.alergias || '-'}</Text>
        </View>
      </View>
    </View>
  );
}

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Meus pets" navigation={navigation} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : (
        <>
          <FlatList
            data={pets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PetCard pet={item} navigation={navigation} />}
            contentContainerStyle={[styles.listContent, pets.length === 0 && styles.emptyContent]}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('RegisterPet')}
          >
            <Text style={styles.addButtonText}>Cadastrar novo pet!</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
    gap: 16,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6E6586',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#F6F0FF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DED0F8',
  },
  petName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  petContent: {
    flexDirection: 'row',
    gap: 14,
  },
  petAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E7D9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfo: {
    flex: 1,
    gap: 5,
  },
  petInfoText: {
    color: '#5F5774',
    fontSize: 13,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '700',
  },
});
