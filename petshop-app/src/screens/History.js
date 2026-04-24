import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { Colors } from '../styles/colors';
import BottomTabs from '../components/BottomTabs';
import ScreenHeader from '../components/ScreenHeader';

function HistoryCard({ item }) {
  const formattedDate = new Date(item.date).toLocaleString('pt-BR');

  return (
    <View style={styles.card}>
      <Text style={styles.serviceTitle}>{item.service?.nome || 'Servico'}</Text>
      <Text style={styles.serviceMeta}>Pet: {item.pet?.nome || '-'}</Text>
      <Text style={styles.serviceMeta}>Preco: R$ {Number(item.service?.preco || 0).toFixed(2)}</Text>
      <Text style={styles.serviceMeta}>Quando: {formattedDate}</Text>
      <Text style={styles.serviceMeta}>Status: {item.status || 'agendado'}</Text>
      {item.observacao ? <Text style={styles.serviceMeta}>Obs: {item.observacao}</Text> : null}
    </View>
  );
}

export default function HistoryScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao carregar historico:', error);
      setErrorMessage(error.response?.data?.error || 'Nao foi possivel carregar o historico.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Historico de servicos" navigation={navigation} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : errorMessage ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>}
        />
      )}

      <BottomTabs navigation={navigation} active="home" />
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
    gap: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6E6586',
    marginTop: 30,
  },
  errorText: {
    color: '#B42318',
    textAlign: 'center',
    lineHeight: 22,
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
  serviceTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  serviceMeta: {
    color: '#5F5774',
    fontSize: 13,
    marginBottom: 4,
  },
});
