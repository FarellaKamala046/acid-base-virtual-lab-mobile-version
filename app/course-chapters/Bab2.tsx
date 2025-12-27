import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Bab2() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.p}>
        Di Bab 1, kita sudah kenalan sama sifat-sifat umum asam dan basa. Nah, di Bab 2 ini, kita akan gali lebih dalam lagi! Para ilmuwan kimia punya beberapa teori untuk menjelaskan apa sih sebenarnya yang membuat suatu zat bersifat asam atau basa di tingkat molekulernya.
      </Text>
      <Text style={styles.p}>
        Kita akan pelajari tiga teori utama, dari yang paling awal sampai yang paling modern: Arrhenius, Brønsted-Lowry, dan Lewis.
      </Text>

      <Text style={styles.h2}>1. Teori Asam Basa Arrhenius</Text>
      <Text style={styles.p}>
        Svante Arrhenius (1884) mendefinisikan asam dan basa berdasarkan perilakunya saat dilarutkan dalam air (aq).
      </Text>
      <View style={styles.listContainer}>
        <View style={styles.listItemRow}>
          <Text style={styles.bullet}>• </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.listItemText}>
              <Text style={styles.bold}>Asam Arrhenius:</Text> Melepaskan ion hidrogen (H⁺).
            </Text>
            <View style={styles.codeInline}>
              <Text style={styles.codeText}>HCl(aq) → H⁺(aq) + Cl⁻(aq)</Text>
            </View>
          </View>
        </View>

        <View style={styles.listItemRow}>
          <Text style={styles.bullet}>• </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.listItemText}>
              <Text style={styles.bold}>Basa Arrhenius:</Text> Melepaskan ion hidroksida (OH⁻).
            </Text>
            <View style={styles.codeInline}>
              <Text style={styles.codeText}>NaOH(aq) → Na⁺(aq) + OH⁻(aq)</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.caption}>
        Keterbatasan: Hanya berlaku dalam air dan tidak bisa menjelaskan basa seperti NH₃.
      </Text>

      <Text style={styles.h2}>2. Teori Asam Basa Brønsted-Lowry</Text>
      <Text style={styles.p}>
        Brønsted dan Lowry (1923) fokus pada transfer proton (ion H⁺).
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItemText}>• <Text style={styles.bold}>Asam Brønsted-Lowry:</Text> Donor (pemberi) proton (H⁺).</Text>
        <Text style={styles.listItemText}>• <Text style={styles.bold}>Basa Brønsted-Lowry:</Text> Akseptor (penerima) proton (H⁺).</Text>
      </View>

      <Text style={styles.pBold}>Konsep Pasangan Konjugasi:</Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItemTextSmall}>1. Asam → (setelah memberi H⁺) → Basa Konjugasi</Text>
        <Text style={styles.listItemTextSmall}>2. Basa → (setelah menerima H⁺) → Asam Konjugasi</Text>
      </View>

      <Text style={styles.p}>Contoh:</Text>
      <View style={styles.codeBlock}>
        <Text style={styles.codeTextCenter}>
          HCl(aq) + H₂O(l) ⇌ Cl⁻(aq) + H₃O⁺(aq) {"\n"}
          (Asam) + (Basa) ⇌ (Basa Konj.) + (Asam Konj.)
        </Text>
      </View>
      <View style={styles.codeBlock}>
        <Text style={styles.codeTextCenter}>
          NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq) {"\n"}
          (Basa) + (Asam) ⇌ (Asam Konj.) + (Basa Konj.)
        </Text>
      </View>
      <Text style={styles.caption}>
        Kelebihan: Lebih luas, bisa menjelaskan basa NH₃, memperkenalkan konsep konjugasi.
      </Text>

      <Text style={styles.h2}>3. Teori Asam Basa Lewis</Text>
      <Text style={styles.p}>
        Gilbert N. Lewis (1923) punya definisi paling luas, fokus pada pasangan elektron bebas (PEB).
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItemText}>• <Text style={styles.bold}>Asam Lewis:</Text> Akseptor (penerima) PEB.</Text>
        <Text style={styles.listItemText}>• <Text style={styles.bold}>Basa Lewis:</Text> Donor (pemberi) PEB.</Text>
      </View>

      <Text style={styles.p}>Contoh (tanpa H⁺):</Text>
      <View style={styles.codeBlock}>
        <Text style={styles.codeTextCenter}>
          BF₃ + :NH₃ → F₃B ← :NH₃ {"\n"}
          (Asam Lewis) + (Basa Lewis) → (Ikatan Koordinasi)
        </Text>
      </View>
      <Text style={styles.caption}>
        Kelebihan: Paling umum, mencakup semua teori lain, bisa menjelaskan reaksi tanpa proton.
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
    color: '#1a202c',
    marginTop: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
    paddingBottom: 4,
  },
  p: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 16,
  },
  pBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 16,
  },
  listItemRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#4a5568',
  },
  listItemText: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 22,
  },
  listItemTextSmall: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
    paddingLeft: 10,
  },
  codeInline: {
    backgroundColor: '#f7fafc',
    padding: 4,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  codeBlock: {
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#2d3748',
  },
  codeTextCenter: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#2d3748',
    textAlign: 'center',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 16,
  },
});