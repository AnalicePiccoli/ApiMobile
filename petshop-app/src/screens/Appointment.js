import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Colors } from '../styles/colors';

export default function Appointment() {
  const [service, setService] = useState('');
  const [observation, setObservation] = useState('');

  const services = ["Banho", "Tosa", "Banho e Tosa"];

  const handleAgendar = async () => {
    Alert.alert("Agendado", `Serviço: ${service}\nObs: ${observation}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Serviço</Text>
      {services.map(s => (
        <TouchableOpacity key={s} style={[styles.card, service === s && styles.selectedCard]} onPress={() => setService(s)}>
          <Text style={service === s ? styles.selectedText : styles.cardText}>{s}</Text>
        </TouchableOpacity>
      ))}
      <TextInput 
        style={styles.textArea} 
        placeholder="Detalhes adicionais (Observações)..." 
        multiline 
        onChangeText={setObservation} 
      />
      <TouchableOpacity style={styles.button} onPress={handleAgendar}>
        <Text style={styles.buttonText}>CONFIRMAR HORÁRIO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 22, color: Colors.text, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: Colors.white, padding: 20, borderRadius: 10, marginBottom: 10 },
  selectedCard: { backgroundColor: Colors.primary },
  cardText: { color: Colors.text },
  selectedText: { color: Colors.white, fontWeight: 'bold' },
  textArea: { backgroundColor: Colors.white, padding: 15, borderRadius: 10, height: 100, marginTop: 10, textAlignVertical: 'top' },
  button: { backgroundColor: Colors.secondary, padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: Colors.white, fontWeight: 'bold' }
});