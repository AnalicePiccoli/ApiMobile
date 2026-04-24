import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { Colors } from '../styles/colors';
import BottomTabs from '../components/BottomTabs';
import ScreenHeader from '../components/ScreenHeader';

function emptyServiceForm() {
  return {
    id: null,
    nome: '',
    descricao: '',
    tempoEstimadoMin: '',
    preco: '',
  };
}

const ServiceItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.resultTitle}>{item.nome}</Text>
    <Text style={styles.resultDescription}>{item.descricao || 'Sem descricao informada.'}</Text>
    <View style={styles.resultFooter}>
      <Text style={styles.resultMeta}>Tempo estimado: {item.tempoEstimadoMin || 0} min</Text>
      <Text style={styles.resultMeta}>Preco: R$ {Number(item.preco || 0).toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);

export default function ServicesScreen({ navigation, route }) {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');
  const [saving, setSaving] = useState(false);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [servicesResponse, meResponse] = await Promise.all([
        api.get('/services'),
        api.get('/users/me'),
      ]);
      setServices(servicesResponse.data);
      setRole(meResponse.data?.role || 'user');
    } catch (error) {
      console.error('Erro ao carregar servicos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (search = '') => {
    try {
      setLoading(true);
      const response = await api.get('/services', {
        params: search ? { q: search } : undefined,
      });
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar servicos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchServices(query.trim());
  };

  const handleEdit = (service) => {
    setServiceForm({
      id: service._id,
      nome: service.nome || '',
      descricao: service.descricao || '',
      tempoEstimadoMin: String(service.tempoEstimadoMin || ''),
      preco: String(service.preco || ''),
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      await fetchServices(query.trim());
      Alert.alert('Sucesso', 'Servico removido com sucesso.');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Nao foi possivel remover o servico.';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleSaveService = async () => {
    try {
      setSaving(true);
      const payload = {
        nome: serviceForm.nome.trim(),
        descricao: serviceForm.descricao.trim(),
        tempoEstimadoMin: Number(serviceForm.tempoEstimadoMin || 0),
        preco: Number(serviceForm.preco || 0),
      };

      if (serviceForm.id) {
        await api.put(`/services/${serviceForm.id}`, payload);
      } else {
        await api.post('/services', payload);
      }

      setServiceForm(emptyServiceForm());
      await fetchServices(query.trim());
      Alert.alert('Sucesso', serviceForm.id ? 'Servico atualizado com sucesso.' : 'Servico criado com sucesso.');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Nao foi possivel salvar o servico.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = route.params?.mode === 'admin' || role === 'admin';

  return (
    <View style={styles.container}>
      <ScreenHeader title={isAdmin ? 'Gerenciar servicos' : 'Servicos'} navigation={navigation} />

      <View style={styles.searchBox}>
        <Ionicons name="arrow-back" size={18} color={Colors.text} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#9589AF"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={() => { setQuery(''); fetchServices(); }}>
          <Ionicons name="close" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {isAdmin ? (
        <View style={styles.adminPanel}>
          <Text style={styles.panelTitle}>{serviceForm.id ? 'Editar servico' : 'Novo servico'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={serviceForm.nome}
            onChangeText={(value) => setServiceForm((prev) => ({ ...prev, nome: value }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Descricao"
            value={serviceForm.descricao}
            onChangeText={(value) => setServiceForm((prev) => ({ ...prev, descricao: value }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Tempo estimado em minutos"
            keyboardType="numeric"
            value={serviceForm.tempoEstimadoMin}
            onChangeText={(value) => setServiceForm((prev) => ({ ...prev, tempoEstimadoMin: value }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Preco"
            keyboardType="numeric"
            value={serviceForm.preco}
            onChangeText={(value) => setServiceForm((prev) => ({ ...prev, preco: value }))}
          />
          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveService} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar servico'}</Text>
            </TouchableOpacity>
            {serviceForm.id ? (
              <TouchableOpacity style={styles.cancelButton} onPress={() => setServiceForm(emptyServiceForm())}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('RegisterPet')}>
          <Text style={styles.quickActionText}>Cadastrar novo pet</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <ServiceItem item={item} onPress={() => isAdmin && handleEdit(item)} />
              {isAdmin ? (
                <View style={styles.serviceAdminActions}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.serviceActionText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                    <Text style={styles.serviceActionText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={() => navigation.navigate('Appointment', { serviceId: item._id })}
                >
                  <Text style={styles.scheduleButtonText}>Agendar este servico</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum servico encontrado.</Text>}
        />
      )}

      <BottomTabs navigation={navigation} active="services" />
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 14,
    backgroundColor: '#F6F0FF',
    paddingHorizontal: 14,
    minHeight: 54,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
  },
  adminPanel: {
    backgroundColor: '#F6F0FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  panelTitle: {
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    color: Colors.text,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#E7D9FF',
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: '700',
  },
  quickAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E7D9FF',
    marginBottom: 16,
  },
  quickActionText: {
    color: Colors.text,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 12,
    gap: 14,
  },
  resultCard: {
    backgroundColor: '#F6F0FF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultDescription: {
    color: '#5F5774',
    fontSize: 13,
    marginBottom: 12,
  },
  resultFooter: {
    gap: 6,
  },
  resultMeta: {
    color: '#5F5774',
    fontSize: 13,
  },
  scheduleButton: {
    marginTop: -2,
    marginBottom: 12,
    marginHorizontal: 8,
    backgroundColor: '#E7D9FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: Colors.text,
    fontWeight: '700',
  },
  serviceAdminActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -2,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#E7D9FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#DE3131',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  serviceActionText: {
    color: Colors.white,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6E6586',
    textAlign: 'center',
    marginTop: 24,
  },
});
