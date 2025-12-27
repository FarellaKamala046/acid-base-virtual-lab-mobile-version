import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Bab4() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.p}>
        Selamat datang di Bab 4! Kita akan mempelajari reaksi paling fundamental antara asam dan basa, yaitu reaksi netralisasi. Konsep ini adalah dasar dari teknik penting di laboratorium kimia yaitu proses titrasi.
      </Text>

      <Text style={styles.h2}>1. Reaksi Netralisasi: Asam + Basa → Garam + Air</Text>
      <Text style={styles.p}>
        Ketika asam dan basa dicampur, ion H⁺ dari asam bereaksi dengan ion OH⁻ dari basa membentuk H₂O (netral). Ion sisanya membentuk garam.
      </Text>
      <View style={[styles.codeBlock, { backgroundColor: '#eef2ff' }]}>
        <Text style={styles.codeTextLarge}>Asam + Basa → Garam + Air</Text>
      </View>
      <Text style={styles.textSm}>Contoh:</Text>
      <View style={[styles.codeBlock, { backgroundColor: '#eef2ff' }]}>
        <Text style={styles.codeText}>HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)</Text>
      </View>

      {/* 2. Titrasi */}
      <Text style={styles.h2}>2. Titrasi: Teknik Laboratorium untuk Netralisasi</Text>
      <Text style={styles.p}>
        Titrasi Asam Basa adalah metode untuk menentukan konsentrasi suatu larutan (analit) dengan mereaksikannya secara bertahap menggunakan larutan standar (titran) yang diketahui konsentrasinya hingga mencapai titik ekuivalen (mol H⁺ = mol OH⁻).
      </Text>

      <Text style={styles.h3}>Alat Utama Titrasi:</Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Buret:</Text> Tabung berskala dengan keran untuk meneteskan titran.</Text>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Labu Erlenmeyer:</Text> Wadah untuk analit dan tempat reaksi.</Text>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Statif & Klem:</Text> Penyangga buret.</Text>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Pipet Volume:</Text> Mengambil volume analit dengan akurat.</Text>
        <Text style={styles.listItemSmall}>• <Text style={styles.bold}>Indikator:</Text> Zat penanda perubahan warna di titik akhir titrasi (misal: Fenolftalein/PP).</Text>
      </View>

      <Text style={styles.h3}>Langkah Umum Titrasi:</Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItemSmall}>1. Masukkan volume analit yang akurat + indikator ke Erlenmeyer.</Text>
        <Text style={styles.listItemSmall}>2. Isi buret dengan titran standar.</Text>
        <Text style={styles.listItemSmall}>3. Teteskan titran perlahan ke Erlenmeyer sambil diaduk.</Text>
        <Text style={styles.listItemSmall}>4. Hentikan titrasi saat warna indikator berubah permanen.</Text>
        <Text style={styles.listItemSmall}>5. Catat volume titran yang terpakai.</Text>
        <Text style={styles.listItemSmall}>6. Hitung konsentrasi analit dengan rumus titrasi.</Text>
      </View>

      <Text style={styles.h3}>Rumus Titrasi:</Text>
      <View style={[styles.codeBlock, { backgroundColor: '#eff6ff' }]}>
        <Text style={styles.codeText}>
          M{"asam"} × V{"asam"} × a = M{"basa"} × V{"basa"} × b
        </Text>
      </View>
      <Text style={styles.caption}>
        (M=Molaritas, V=Volume, a=valensi asam, b=valensi basa)
      </Text>

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
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 18,
    marginBottom: 10,
  },
  p: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  textSm: {
    fontSize: 14,
    marginBottom: 4,
    color: '#374151',
  },
  bold: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 16,
    paddingLeft: 5,
  },
  listItemSmall: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  codeTextLarge: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#1f2937',
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: -8,
    marginBottom: 16,
    textAlign: 'center',
  },
});