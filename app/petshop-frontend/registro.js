import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../src/services/authService';

export default function Register() {
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '', endereco: '' });
  const router = useRouter();

  const handleRegister = async () => {
    await authService.register(form);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar conta:</Text>
      
      {['nome', 'cpf', 'email', 'telefone', 'endereco'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.toUpperCase()}
          onChangeText={(val) => setForm({ ...form, [field]: val })}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Salvar Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#9b67ff', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});