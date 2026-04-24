import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors } from '../styles/colors';

export default function RegisterPet() {
  const [form, setForm] = useState({ name: '', breed: '', age: '', weight: '', size: '', allergies: '' });

  const handlePetCadastro = async () => {
    try {
      const response = await fetch('http://192.168.1.13:3000/pets/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, owner: "ID_DO_USUARIO_LOGADO" }) 
      });
      if (response.ok) Alert.alert("Sucesso", "Pet cadastrado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Pet</Text>
      <TextInput style={styles.input} placeholder="Nome do Pet" onChangeText={(t) => setForm({...form, name: t})} />
      <TextInput style={styles.input} placeholder="Raça" onChangeText={(t) => setForm({...form, breed: t})} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput style={[styles.input, { width: '45%' }]} placeholder="Idade" keyboardType="numeric" onChangeText={(t) => setForm({...form, age: t})} />
        <TextInput style={[styles.input, { width: '45%' }]} placeholder="Peso" keyboardType="numeric" onChangeText={(t) => setForm({...form, weight: t})} />
      </View>
      <TextInput style={styles.input} placeholder="Porte (P, M, G)" onChangeText={(t) => setForm({...form, size: t})} />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Alergias/Observações" multiline onChangeText={(t) => setForm({...form, allergies: t})} />
      <TouchableOpacity style={styles.button} onPress={handlePetCadastro}>
        <Text style={styles.buttonText}>CADASTRAR PET</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 24, color: Colors.text, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: Colors.white, padding: 15, borderRadius: 8, marginBottom: 15, borderColor: Colors.inputBorder, borderWidth: 1 },
  button: { backgroundColor: Colors.secondary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: Colors.white, fontWeight: 'bold' }
});