import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../styles/colors';
import api, { getAuthToken } from '../services/api';
import ScreenHeader from '../components/ScreenHeader';

export default function RegisterPet({ navigation, route }) {
  const petId = route.params?.petId;
  const isEditing = Boolean(petId);

  const initialForm = useMemo(
    () => ({
      name: '',
      breed: '',
      age: '',
      weight: '',
      size: '',
      allergies: '',
    }),
    []
  );

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(isEditing);

  useEffect(() => {
    const loadPet = async () => {
      if (!petId) {
        setScreenLoading(false);
        return;
      }

      try {
        const response = await api.get(`/users/pets/${petId}`);
        setForm({
          name: response.data?.nome || '',
          breed: response.data?.raca || '',
          age: response.data?.idade ? String(response.data.idade) : '',
          weight: response.data?.peso ? String(response.data.peso) : '',
          size: response.data?.porte || '',
          allergies: response.data?.alergias || '',
        });
      } catch (_error) {
        Alert.alert('Erro', 'Nao foi possivel carregar os dados do pet.');
        navigation.goBack();
      } finally {
        setScreenLoading(false);
      }
    };

    loadPet();
  }, [navigation, petId]);

  const payload = {
    name: form.name.trim(),
    breed: form.breed.trim(),
    age: form.age ? Number(form.age) : undefined,
    peso: form.weight ? Number(form.weight) : undefined,
    porte: form.size.trim(),
    alergias: form.allergies.trim(),
  };

  const handlePetCadastro = async () => {
    if (!getAuthToken()) {
      Alert.alert('Sessao expirada', 'Faca login novamente para cadastrar um pet.');
      navigation.navigate('Login');
      return;
    }

    if (!form.name.trim()) {
      Alert.alert('Erro', 'Informe o nome do pet.');
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await api.put(`/users/pets/${petId}`, payload);
      } else {
        await api.post('/users/pets', payload);
      }

      Alert.alert('Sucesso', isEditing ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Pets') },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Nao foi possivel salvar o pet.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!petId) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/users/pets/${petId}`);
      Alert.alert('Sucesso', 'Pet excluido com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Pets') },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Nao foi possivel excluir o pet.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title={isEditing ? 'Editar' : 'Novo Pet'} navigation={navigation} />

      <TextInput
        style={styles.input}
        placeholder="Nome do Pet"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Raca"
        value={form.breed}
        onChangeText={(text) => setForm({ ...form, breed: text })}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Idade"
          keyboardType="numeric"
          value={form.age}
          onChangeText={(text) => setForm({ ...form, age: text })}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Peso"
          keyboardType="numeric"
          value={form.weight}
          onChangeText={(text) => setForm({ ...form, weight: text })}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Porte (P, M, G)"
        value={form.size}
        onChangeText={(text) => setForm({ ...form, size: text })}
      />
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Alergias e observacoes"
        multiline
        value={form.allergies}
        onChangeText={(text) => setForm({ ...form, allergies: text })}
      />

      {isEditing ? (
        <View style={styles.editActions}>
          <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handlePetCadastro} disabled={loading}>
            <Text style={styles.actionText}>{loading ? 'SALVANDO...' : 'Salvar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete} disabled={loading}>
            <Text style={styles.actionText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={handlePetCadastro} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'CADASTRANDO...' : 'CADASTRAR PET'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: Colors.inputBorder,
    borderWidth: 1,
    color: Colors.text,
  },
  halfInput: { width: '48%' },
  notesInput: { height: 120, textAlignVertical: 'top' },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: { color: Colors.white, fontWeight: '700' },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1EA967',
  },
  deleteButton: {
    backgroundColor: '#DE3131',
  },
  actionText: {
    color: Colors.white,
    fontWeight: '700',
  },
});
