import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api, { clearAuthToken } from '../services/api';
import { Colors } from '../styles/colors';
import BottomTabs from '../components/BottomTabs';
import ScreenHeader from '../components/ScreenHeader';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const [userResponse, healthResponse] = await Promise.all([
        api.get('/users/me'),
        api.get('/health'),
      ]);
      setUser(userResponse.data);
      setApiOnline(Boolean(healthResponse.data?.ok));
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const handleLogout = () => {
    clearAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  const menuItems =
    user?.role === 'admin'
      ? [
          { label: 'Informacoes de perfil', icon: 'person-outline', screen: 'Profile' },
          { label: 'Gerenciar servicos', icon: 'construct-outline', screen: 'Services', params: { mode: 'admin' } },
        ]
      : [
          { label: 'Meus pets', icon: 'paw-outline', screen: 'Pets' },
          { label: 'Informacoes de perfil', icon: 'person-outline', screen: 'Profile' },
          { label: 'Historico de servicos', icon: 'time-outline', screen: 'History' },
          { label: 'Servicos', icon: 'list-outline', screen: 'Services' },
        ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Meu perfil" navigation={navigation} showBack={false} />

      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person-outline" size={72} color={Colors.secondary} />
          <View style={styles.avatarBadge}>
            <Ionicons name="camera-outline" size={18} color={Colors.text} />
          </View>
        </View>
        <Text style={styles.username}>{user?.nome || 'Usuario'}</Text>
        <Text style={styles.roleBadge}>{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
        <Text style={styles.apiStatus}>{apiOnline ? 'API online' : 'API indisponivel'}</Text>
      </View>

      <View style={styles.menuCard}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen, item.params)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={18} color={Colors.text} />
              <Text style={styles.menuText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.text} />
          </TouchableOpacity>
        ))}
      </View>
      <BottomTabs
        navigation={navigation}
        active="home"
        extraAction={{ label: 'Deslogar', onPress: handleLogout, variant: 'danger' }}
      />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E7D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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
  username: {
    color: Colors.text,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  apiStatus: {
    marginTop: 6,
    color: '#6E6586',
    fontSize: 12,
  },
  roleBadge: {
    marginTop: 8,
    backgroundColor: '#E7D9FF',
    color: Colors.text,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: '#F6F0FF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7DDFB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    color: Colors.text,
    fontSize: 14,
  },
});
