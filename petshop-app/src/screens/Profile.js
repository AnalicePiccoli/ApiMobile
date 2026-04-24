import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { Colors } from '../styles/colors';
import BottomTabs from '../components/BottomTabs';
import ScreenHeader from '../components/ScreenHeader';

export default function ProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/me');
      setForm({
        nome: response.data?.nome || '',
        cpf: response.data?.cpf || '',
        email: response.data?.email || '',
        telefone: response.data?.telefone || '',
        endereco: response.data?.endereco || '',
      });
    } catch (error) {
      console.error('Erro ao carregar usuario:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/users/me', {
        nome: form.nome.trim(),
        cpf: form.cpf.trim(),
        email: form.email.trim().toLowerCase(),
        telefone: form.telefone.trim(),
        endereco: form.endereco.trim(),
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.errors?.join('\n') ||
        'Nao foi possivel atualizar o perfil.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Informacoes de perfil" navigation={navigation} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : (
        <>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={72} color={Colors.secondary} />
            <View style={styles.avatarBadge}>
              <Ionicons name="camera-outline" size={18} color={Colors.text} />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={form.nome} onChangeText={(value) => updateField('nome', value)} />

            <Text style={styles.label}>CPF</Text>
            <TextInput style={styles.input} value={form.cpf} onChangeText={(value) => updateField('cpf', value)} />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              autoCapitalize="none"
              onChangeText={(value) => updateField('email', value)}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} value={form.telefone} onChangeText={(value) => updateField('telefone', value)} />

            <Text style={styles.label}>Endereco</Text>
            <TextInput style={styles.input} value={form.endereco} onChangeText={(value) => updateField('endereco', value)} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar alteracoes'}</Text>
          </TouchableOpacity>

          <BottomTabs navigation={navigation} active="home" />
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
  avatarCircle: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E7D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  avatarBadge: {
    position: 'absolute',
    right: 22,
    bottom: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9CFF7',
  },
  infoCard: {
    backgroundColor: '#F6F0FF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    fontWeight: '700',
  },
});
