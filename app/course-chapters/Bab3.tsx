import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Bab3() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.p}>
        Selamat datang di Bab 3! Sekarang kita akan belajar cara mengukur kekuatan asam dan basa menggunakan skala pH dan belajar cara menghitungnya, terutama untuk asam dan basa kuat.
      </Text>

      <Text style={styles.h2}>1. Apa itu pH? (Derajat Keasaman)</Text>
      <Text style={styles.p}>
        pH adalah ukuran tingkat keasaman atau kebasaan suatu larutan, dengan skala dari 0 hingga 14.
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Netral:</Text> pH = <Text style={styles.bold}>7</Text> (Air murni)</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Asam:</Text> pH {"<"} <Text style={styles.bold}>7</Text> (Makin kecil makin asam)</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Basa:</Text> pH {">"} <Text style={styles.bold}>7</Text> (Makin besar makin basa)</Text>
      </View>
      <Text style={styles.caption}>
        Ingat: Skala pH itu logaritmik! Beda 1 pH = beda 10x keasaman/kebasaan.
      </Text>

      <Text style={styles.h2}>2. Hubungan pH dengan Konsentrasi Ion H⁺</Text>
      <Text style={styles.p}>
        Keasaman ditentukan oleh konsentrasi ion hidrogen [H⁺]. Rumusnya:
      </Text>
      <View style={[styles.codeBlock, { backgroundColor: '#eff6ff' }]}>
        <Text style={styles.codeTextLarge}>pH = - log [H⁺]</Text>
      </View>
      <View style={[styles.codeBlock, { backgroundColor: '#eff6ff' }]}>
        <Text style={styles.codeTextLarge}>[H⁺] = 10⁻ᵖᴴ</Text>
      </View>

      <Text style={styles.h2}>3. Apa itu pOH? (Ukuran Kebasaan)</Text>
      <Text style={styles.p}>
        Mirip dengan pH, pOH mengukur kebasaan berdasarkan konsentrasi ion hidroksida [OH⁻].
      </Text>
      <View style={[styles.codeBlock, { backgroundColor: '#eef2ff' }]}>
        <Text style={styles.codeTextLarge}>pOH = - log [OH⁻]</Text>
      </View>

      <Text style={styles.h2}>4. Hubungan pH dan pOH</Text>
      <Text style={styles.p}>
        Pada suhu 25°C, keduanya selalu berhubungan:
      </Text>
      <View style={[styles.codeBlock, { backgroundColor: '#f5f3ff' }]}>
        <Text style={styles.codeTextLarge}>pH + pOH = 14</Text>
      </View>

      <Text style={styles.h2}>5. Asam Kuat dan Basa Kuat</Text>
      <Text style={styles.p}>
        Asam/Basa Kuat adalah yang terionisasi sempurna (100%) dalam air. Contoh umum:
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Asam Kuat:</Text> HCl, H₂SO₄, HNO₃</Text>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Basa Kuat:</Text> NaOH, KOH, Ca(OH)₂</Text>
      </View>

      <Text style={styles.h2}>6. Menghitung pH Asam Kuat dan Basa Kuat</Text>
      <Text style={styles.pBold}>Untuk Asam Kuat:</Text>
      <View style={[styles.codeBlock, { backgroundColor: '#f0fdf4' }]}>
        <Text style={styles.codeText}>[H⁺] = Molaritas Asam × valensi (a)</Text>
      </View>
      <View style={[styles.codeBlock, { backgroundColor: '#f0fdf4' }]}>
        <Text style={styles.codeText}>pH = - log [H⁺]</Text>
      </View>

      <Text style={styles.pBold}>Untuk Basa Kuat:</Text>
      <View style={[styles.codeBlock, { backgroundColor: '#fefce8' }]}>
        <Text style={styles.codeText}>[OH⁻] = Molaritas Basa × valensi (b)</Text>
      </View>
      <View style={[styles.codeBlock, { backgroundColor: '#fefce8' }]}>
        <Text style={styles.codeText}>pOH = - log [OH⁻]</Text>
      </View>
      <View style={[styles.codeBlock, { backgroundColor: '#fefce8' }]}>
        <Text style={styles.codeText}>pH = 14 - pOH</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  p: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  pBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 16,
    paddingLeft: 5,
  },
  listItem: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  listItemSmall: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  codeTextLarge: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#1f2937',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#1f2937',
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
});