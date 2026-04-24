import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Platform } from 'react-native';
import api from '../services/api';
import { Colors } from '../styles/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomTabs from '../components/BottomTabs';

function pad(value) {
  return String(value).padStart(2, '0');
}

function createBrazilianDefaults() {
  const now = new Date();
  now.setHours(now.getHours() + 1);

  return {
    date: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
}

function parseBrazilianDateTime(dateValue, timeValue) {
  const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateValue.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeValue.trim());

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const [, day, month, year] = dateMatch;
  const [, hours, minutes] = timeMatch;

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

export default function Appointment({ navigation, route }) {
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(route.params?.serviceId || '');
  const defaults = useMemo(() => createBrazilianDefaults(), []);
  const [date, setDate] = useState(defaults.date);
  const [time, setTime] = useState(defaults.time);
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [petsResponse, servicesResponse] = await Promise.all([
          api.get('/users/pets'),
          api.get('/services'),
        ]);

        setPets(petsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do agendamento:', error);
      }
    };

    loadData();
  }, []);

  const goHomeAfterSuccess = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleAgendar = async () => {
    if (!selectedPetId || !selectedServiceId) {
      Alert.alert('Erro', 'Selecione um pet e um servico antes de continuar.');
      return;
    }

    const parsedDate = parseBrazilianDateTime(date, time);
    if (!parsedDate) {
      Alert.alert('Erro', 'Preencha a data e o horario no formato 24/04/2026 e 14:30.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/appointments', {
        petId: selectedPetId,
        serviceId: selectedServiceId,
        date: parsedDate,
        observacao: observation.trim(),
      });

      if (Platform.OS === 'web') {
        window.alert('Servico agendado com sucesso!');
        goHomeAfterSuccess();
        return;
      }

      Alert.alert('Sucesso', 'Servico agendado com sucesso!', [
        { text: 'OK', onPress: goHomeAfterSuccess },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Nao foi possivel agendar o servico.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Agendar servico" navigation={navigation} />

      <Text style={styles.sectionTitle}>Escolha o pet</Text>
      {pets.map((pet) => (
        <TouchableOpacity
          key={pet._id}
          style={[styles.card, selectedPetId === pet._id && styles.selectedCard]}
          onPress={() => setSelectedPetId(pet._id)}
        >
          <Text style={selectedPetId === pet._id ? styles.selectedText : styles.cardText}>{pet.nome}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Escolha o servico</Text>
      {services.map((service) => (
        <TouchableOpacity
          key={service._id}
          style={[styles.card, selectedServiceId === service._id && styles.selectedCard]}
          onPress={() => setSelectedServiceId(service._id)}
        >
          <Text style={selectedServiceId === service._id ? styles.selectedText : styles.cardText}>{service.nome}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Quando</Text>
      <Text style={styles.helperText}>Use o formato brasileiro para agendar.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateTimeRow}>
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="dd/mm/aaaa"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={[styles.input, styles.timeInput]}
          placeholder="hh:mm"
          value={time}
          onChangeText={setTime}
        />
      </ScrollView>

      <TextInput
        style={styles.textArea}
        placeholder="Detalhes adicionais (observacoes)..."
        multiline
        value={observation}
        onChangeText={setObservation}
      />
      <TouchableOpacity style={styles.button} onPress={handleAgendar} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'SALVANDO...' : 'CONFIRMAR HORARIO'}</Text>
      </TouchableOpacity>

      <BottomTabs navigation={navigation} active="services" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 10,
  },
  helperText: {
    color: '#6E6586',
    fontSize: 12,
    marginBottom: 10,
  },
  dateTimeRow: {
    gap: 12,
    marginBottom: 10,
  },
  card: { backgroundColor: Colors.white, padding: 20, borderRadius: 12, marginBottom: 10 },
  selectedCard: { backgroundColor: Colors.primary },
  cardText: { color: Colors.text },
  selectedText: { color: Colors.white, fontWeight: 'bold' },
  input: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  dateInput: {
    width: 170,
  },
  timeInput: {
    width: 110,
  },
  textArea: { backgroundColor: Colors.white, padding: 15, borderRadius: 12, height: 100, marginTop: 10, textAlignVertical: 'top' },
  button: { backgroundColor: Colors.secondary, padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  buttonText: { color: Colors.white, fontWeight: 'bold' },
});
