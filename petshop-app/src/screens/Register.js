import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import api, { setAuthToken, setCurrentUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !cpf || !email || !password || !telefone) {
      Alert.alert('Erro', 'Preencha nome, CPF, email, senha e telefone.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas nao coincidem.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        nome: nome.trim(),
        cpf: cpf.trim(),
        email: email.trim().toLowerCase(),
        password,
        telefone: telefone.trim(),
        endereco: endereco.trim(),
      });

      setAuthToken(response.data?.token);
      setCurrentUser(response.data?.user);

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            }),
        },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao cadastrar.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados de tutor</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome Completo *"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="CPF (apenas numeros) *"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
            maxLength={11}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone (com DDD) *"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail *"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Endereco (opcional)"
            value={endereco}
            onChangeText={setEndereco}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha *"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha *"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>
              Ja tem uma conta? <Text style={styles.linkTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40 },
  formContainer: { paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4B0082', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 25, textAlign: 'center' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E6E6FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#666' },
  linkTextBold: { color: '#6A5ACD', fontWeight: 'bold' },
});
