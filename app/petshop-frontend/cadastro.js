import { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { servicoAutenticacao } from '../src/servicos/servicoAutenticacao';

export default function Cadastro() {
  const [formulario, definirFormulario] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: ''
  });

  const [carregando, definirCarregando] = useState(false);
  const roteador = useRouter();

  const atualizarCampo = (campo, valor) => {
    definirFormulario((anterior) => ({
      ...anterior,
      [campo]: valor
    }));
  };

  const realizarCadastro = async () => {
    if (!formulario.nome || !formulario.cpf || !formulario.email || !formulario.senha) {
      Alert.alert('Atenção', 'Preencha nome, CPF, e-mail e senha.');
      return;
    }

    try {
      definirCarregando(true);

      await servicoAutenticacao.cadastrar(formulario);

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      roteador.back();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
      console.log(erro);
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Criar conta</Text>

      <TextInput
        style={estilos.entrada}
        placeholder="Nome"
        value={formulario.nome}
        onChangeText={(valor) => atualizarCampo('nome', valor)}
      />

      <TextInput
        style={estilos.entrada}
        placeholder="CPF"
        value={formulario.cpf}
        onChangeText={(valor) => atualizarCampo('cpf', valor)}
        keyboardType="numeric"
      />

      <TextInput
        style={estilos.entrada}
        placeholder="E-mail"
        value={formulario.email}
        onChangeText={(valor) => atualizarCampo('email', valor)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={estilos.entrada}
        placeholder="Senha"
        value={formulario.senha}
        onChangeText={(valor) => atualizarCampo('senha', valor)}
        secureTextEntry
      />

      <TextInput
        style={estilos.entrada}
        placeholder="Telefone"
        value={formulario.telefone}
        onChangeText={(valor) => atualizarCampo('telefone', valor)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={estilos.entrada}
        placeholder="Endereço"
        value={formulario.endereco}
        onChangeText={(valor) => atualizarCampo('endereco', valor)}
      />

      <TouchableOpacity
        style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
        onPress={realizarCadastro}
        disabled={carregando}
      >
        <Text style={estilos.textoBotao}>
          {carregando ? 'Cadastrando...' : 'Salvar Cadastro'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  entrada: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
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
  }
});
