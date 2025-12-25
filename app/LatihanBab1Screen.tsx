import React from 'react';
import { View, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Impor komponen latihan yang sudah Ken punya
import LatihanBab1 from '../components/LatihanBab1'; 

export default function LatihanBab1Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simulasi Lab Bab 1</Text>
      </View>
      
      {/* Langsung panggil komponen latihannya tanpa ScrollView */}
      <View style={styles.content}>
        <LatihanBab1 />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Request Ken: Background Putih
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1, // Memenuhi layar agar area drag luas
  }
});

