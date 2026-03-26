import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { servicoAutenticacao } from '../src/servicos/servicoAutenticacao';

export default function Login() {
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [carregando, definirCarregando] = useState(false);
  const roteador = useRouter();

  const realizarLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    try {
      definirCarregando(true);

      const resultado = await servicoAutenticacao.login(email, senha);

      if (resultado?.token) {
        roteador.replace('/inicio');
      } else {
        Alert.alert('Erro', 'Login inválido.');
      }
    } catch (erro) {
      console.error(erro);
      Alert.alert('Erro', 'Não foi possível fazer login.');
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Bem-vindo ao PetShop Online!</Text>

      <TextInput
        style={estilos.entrada}
        placeholder="Insira seu e-mail"
        value={email}
        onChangeText={definirEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={estilos.entrada}
        placeholder="Insira sua senha"
        secureTextEntry
        value={senha}
        onChangeText={definirSenha}
      />

      <TouchableOpacity
        style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
        onPress={realizarLogin}
        disabled={carregando}
      >
        <Text style={estilos.textoBotao}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => roteador.push('/cadastro')}>
        <Text style={estilos.textoLink}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40
  },
  entrada: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10
  },
  botao: {
    backgroundColor: '#9b67ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  botaoDesabilitado: {
    opacity: 0.7
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },
  textoLink: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20
  }
});
