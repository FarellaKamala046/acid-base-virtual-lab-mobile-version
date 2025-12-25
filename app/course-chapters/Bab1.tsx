import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Bab1() {
  return (
    <ScrollView style={styles.container}>
      {/* 1. Apa itu Asam? */}
      <Text style={styles.h2}>1. Apa itu Asam?</Text>
      <Text style={styles.p}>
        Asam adalah zat yang secara umum kita kenali dari rasanya yang masam. Kata "asam" sendiri berasal dari bahasa Latin acidus yang artinya "masam". Sifat-sifat asam yaitu:
      </Text>

      {/* List Sifat-sifat Asam */}
      <View style={styles.listContainer}>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Rasa:</Text> Masam atau kecut (Tapi jangan pernah mencicipi zat kimia di lab!).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Konduktivitas:</Text> Larutan asam dapat menghantarkan arus listrik (elektrolit).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Korosif:</Text> Asam pekat (kuat) bersifat korosif, artinya bisa merusak kulit dan logam.</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Reaksi dengan Logam:</Text> Asam bereaksi dengan beberapa logam (seperti seng atau magnesium) menghasilkan gas hidrogen (H₂).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Indikator:</Text> Mengubah warna kertas lakmus biru menjadi merah.</Text>
      </View>

      <Text style={styles.p}>Berikut adalah contoh asam dalam kehidupan sehari-hari:</Text>

      {/* Tabel Asam (Dibuat manual dengan View) */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Nama Asam</Text>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Ditemukan di...</Text>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Rumus</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Asam Sitrat</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Jeruk, lemon, tomat</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>C₆H₈O₇</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Asam Asetat</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Cuka makan</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>CH₃COOH</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Asam Klorida</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Asam lambung</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>HCl</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Asam Sulfat</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Aki mobil</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>H₂SO₄</Text>
        </View>
      </View>

      {/* 2. Apa itu Basa? */}
      <Text style={styles.h2}>2. Apa itu Basa?</Text>
      <Text style={styles.p}>
        Basa (atau base / alkali) adalah zat yang punya sifat berlawanan dengan asam. Secara umum, basa terasa pahit dan licin saat disentuh (seperti sabun). Sifat-sifat basa yaitu:
      </Text>

      <View style={styles.listContainer}>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Rasa:</Text> Pahit (Sama seperti asam, jangan pernah dicicipi!).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Rasa di Kulit:</Text> Terasa licin seperti sabun (karena basa bereaksi dengan minyak di kulitmu).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Konduktivitas:</Text> Larutan basa juga dapat menghantarkan arus listrik (elektrolit).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Kausatik:</Text> Basa kuat bersifat kausatik, artinya bisa merusak kulit (sama berbahayanya dengan asam kuat).</Text>
        <Text style={styles.listItem}>• <Text style={styles.bold}>Indikator:</Text> Mengubah warna kertas lakmus merah menjadi biru.</Text>
      </View>

      <Text style={styles.p}>Berikut adalah contoh basa dalam kehidupan sehari-hari:</Text>

      {/* Tabel Basa */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Nama Basa</Text>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Ditemukan di...</Text>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Rumus</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Natrium Hidroksida</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Sabun, pembersih pipa</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>NaOH</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Amonia</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Pembersih kaca</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>NH₃</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Magnesium Hidroksida</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Obat maag</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Mg(OH)₂</Text>
        </View>
      </View>

      {/* 3. Indikator */}
      <Text style={styles.h2}>3. Indikator: Si "Pendeteksi" Asam Basa</Text>
      <Text style={styles.p}>
        Gimana cara kita tahu sebuah larutan itu asam atau basa kalau kita nggak boleh mencicipinya? Jawabannya: pakai <Text style={styles.bold}>Indikator</Text>.
      </Text>
      
      <Text style={styles.h3}>A. Indikator Lakmus</Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItem}>• Di larutan <Text style={styles.bold}>asam</Text>: Lakmus Biru → jadi Merah.</Text>
        <Text style={styles.listItem}>• Di larutan <Text style={styles.bold}>basa</Text>: Lakmus Merah → jadi Biru.</Text>
        <Text style={styles.listItem}>• Di larutan <Text style={styles.bold}>netral</Text>: Tidak ada perubahan warna.</Text>
      </View>

      <Text style={styles.h3}>B. Indikator Alami</Text>
      {/* Tabel Indikator Alami */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Bahan Alami</Text>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Asam...</Text>
          <Text style={[styles.tableCell, styles.bold, { flex: 1 }]}>Basa...</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Kunyit</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Tetap Kuning</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Merah/Coklat</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Kol Ungu</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Merah/Pink</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Hijau/Kuning</Text>
        </View>
      </View>
      
      {/* Spacer bawah biar nggak mentok navigasi */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 15,
    marginBottom: 8,
  },
  p: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 15,
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 5,
    lineHeight: 22,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeader: {
    backgroundColor: '#f7fafc',
  },
  tableCell: {
    padding: 10,
    fontSize: 14,
    color: '#4a5568',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
});