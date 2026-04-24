import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importando suas telas (Certifique-se de que os nomes dos arquivos estão corretos)
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HomeScreen from './src/screens/Home';
import ProfileScreen from './src/screens/Profile';
import PetsScreen from './src/screens/Pets';
import HistoryScreen from './src/screens/History';
import ServicesScreen from './src/screens/Services';
import RegisterPetScreen from './src/screens/RegisterPet';
import AppointmentScreen from './src/screens/Appointment';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* StatusBar ajusta a cor dos ícones de bateria/hora no topo do celular */}
      <StatusBar style="auto" />
      
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false, // Esconde a barra de título padrão para usarmos nosso design lilás
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Pets" component={PetsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="RegisterPet" component={RegisterPetScreen} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
