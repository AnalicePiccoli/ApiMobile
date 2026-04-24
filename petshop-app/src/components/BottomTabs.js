import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../styles/colors';

export default function BottomTabs({ navigation, active = 'home', extraAction }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, active === 'home' && styles.activeButton]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.label, active === 'home' && styles.activeLabel]}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, active === 'services' && styles.activeButton]}
        onPress={() => navigation.navigate('Services')}
      >
        <Text style={[styles.label, active === 'services' && styles.activeLabel]}>Menu</Text>
      </TouchableOpacity>
      {extraAction ? (
        <TouchableOpacity
          style={[
            styles.button,
            styles.extraButton,
            extraAction.variant === 'danger' && styles.dangerButton,
          ]}
          onPress={extraAction.onPress}
        >
          <Text style={styles.label}>{extraAction.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#CDB8FA',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: Colors.secondary,
  },
  extraButton: {
    backgroundColor: '#B79AF4',
  },
  dangerButton: {
    backgroundColor: '#DE3131',
  },
  label: {
    color: Colors.white,
    fontWeight: '700',
  },
  activeLabel: {
    color: Colors.white,
  },
});
