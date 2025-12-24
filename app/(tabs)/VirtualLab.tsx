import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
// import { db } from '../../firebaseConfig'; // Aktifkan jika sudah setup firebase

const ANIMATION_DURATION = 1000;
// Data warna dummy jika constants belum terhubung
const phColors = ["#ff0000", "#ff4500", "#ff8c00", "#ffd700", "#adff2f", "#7fff00", "#00ff00", "#32cd32", "#00fa9a", "#00ffff", "#1e90ff", "#0000ff", "#4b0082", "#8b00ff", "#9400d3"];

export default function VirtualLab() {
  // State Logika (Sesuai aslinya)
  const [hclConcentration, setHclConcentration] = useState(0.1);
  const [hclVolume, setHclVolume] = useState(50);
  const [naohConcentration, setNaohConcentration] = useState(0.1);
  const [naohVolume, setNaohVolume] = useState(50);

  const [totalVolume, setTotalVolume] = useState('?');
  const [molHPlus, setMolHPlus] = useState('?');
  const [molOHMinus, setMolOHMinus] = useState('?');
  const [finalState, setFinalState] = useState('?');
  const [finalpH, setFinalpH] = useState('?');
  const [indicatorColor, setIndicatorColor] = useState('#ccc');
  const [simulationStatus, setSimulationStatus] = useState('Siap untuk simulasi.');
  const [isSimulating, setIsSimulating] = useState(false);

  // State Animasi
  const [beakerLiquidHeight] = useState(new Animated.Value(0));
  const [beakerLiquidColor, setBeakerLiquidColor] = useState('#add8e6');
  const [beakerLiquidLevelText, setBeakerLiquidLevelText] = useState('0 mL');

  const startSimulation = async () => {
    if (hclVolume === 0 && naohVolume === 0) {
      Alert.alert('Error', 'Mohon masukkan volume HCl atau NaOH.');
      return;
    }

    setIsSimulating(true);
    setSimulationStatus('Simulasi berjalan...');

    // Simulasi Tuang HCl
    setSimulationStatus('Menuang HCl...');
    Animated.timing(beakerLiquidHeight, {
      toValue: 50,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
    setBeakerLiquidColor('#ffc0cb');
    setBeakerLiquidLevelText(`${hclVolume} mL`);

    await new Promise(r => setTimeout(r, ANIMATION_DURATION));

    // Simulasi Tuang NaOH
    setSimulationStatus('Menuang NaOH...');
    Animated.timing(beakerLiquidHeight, {
      toValue: 100,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
    setBeakerLiquidColor('#add8e6');
    setBeakerLiquidLevelText(`${hclVolume + naohVolume} mL`);

    await new Promise(r => setTimeout(r, ANIMATION_DURATION));

    // Logika Perhitungan (Sama persis dengan aslinya)
    const mol_hcl = hclConcentration * (hclVolume / 1000);
    const mol_naoh = naohConcentration * (naohVolume / 1000);
    const total_v = hclVolume + naohVolume;
    
    let ph;
    let state;
    if (mol_hcl > mol_naoh) {
      const h_plus = (mol_hcl - mol_naoh) / (total_v / 1000);
      ph = -Math.log10(h_plus);
      state = 'Larutan bersifat Asam';
      setBeakerLiquidColor('#ff9999');
    } else if (mol_naoh > mol_hcl) {
      const oh_minus = (mol_naoh - mol_hcl) / (total_v / 1000);
      ph = 14 - (-Math.log10(oh_minus));
      state = 'Larutan bersifat Basa';
      setBeakerLiquidColor('#99ccff');
    } else {
      ph = 7;
      state = 'Larutan bersifat Netral';
      setBeakerLiquidColor('lightgray');
    }

    setTotalVolume(total_v.toFixed(2));
    setMolHPlus(mol_hcl.toExponential(2));
    setMolOHMinus(mol_naoh.toExponential(2));
    setFinalState(state);
    setFinalpH(ph.toFixed(2));
    
    // Update Warna Indikator
    const colorIdx = Math.min(Math.max(Math.round(ph), 0), 14);
    setIndicatorColor(phColors[colorIdx]);

    setIsSimulating(false);
    setSimulationStatus('Simulasi selesai.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Input Larutan</Text>
        <Text style={styles.label}>Volume HCl: {hclVolume} mL</Text>
        {/* Slider atau Input bisa ditaruh di sini */}
        
        <TouchableOpacity 
          style={[styles.button, isSimulating && {backgroundColor: '#ccc'}]} 
          onPress={startSimulation}
          disabled={isSimulating}
        >
          <Text style={styles.buttonText}>Mulai Simulasi & Hitung pH</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Simulasi Pencampuran</Text>
        <View style={styles.beakerContainer}>
          <Animated.View style={[styles.liquid, { height: beakerLiquidHeight, backgroundColor: beakerLiquidColor }]} />
          <Text style={styles.liquidLevel}>{beakerLiquidLevelText}</Text>
        </View>
        <Text style={styles.statusText}>{simulationStatus}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hasil & Analisis</Text>
        <Text>Total Volume: {totalVolume} mL</Text>
        <Text>Keadaan Akhir: {finalState}</Text>
        <View style={styles.indicatorRow}>
          <Text>Warna Indikator: </Text>
          <View style={[styles.colorBox, {backgroundColor: indicatorColor}]} />
        </View>
      </View>
      
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9C4', padding: 15 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { marginBottom: 5, fontWeight: '500' },
  button: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  beakerContainer: { 
    height: 150, width: 100, borderWidth: 2, borderColor: '#333', 
    alignSelf: 'center', justifyContent: 'flex-end', overflow: 'hidden', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 
  },
  liquid: { width: '100%' },
  liquidLevel: { textAlign: 'center', fontSize: 12, fontWeight: 'bold', position: 'absolute', width: '100%', bottom: 5 },
  statusText: { textAlign: 'center', marginTop: 10, color: '#666' },
  indicatorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  colorBox: { width: 50, height: 20, borderRadius: 5, marginLeft: 10 }
});