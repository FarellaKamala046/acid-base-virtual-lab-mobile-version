import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, Animated, TextInput, SafeAreaView 
} from 'react-native';

const ANIMATION_DURATION = 1000;
const phColors = ["#ff0000", "#ff4500", "#ff8c00", "#ffd700", "#adff2f", "#7fff00", "#00ff00", "#32cd32", "#00fa9a", "#00ffff", "#1e90ff", "#0000ff", "#4b0082", "#8b00ff", "#9400d3"];

export default function VirtualLab() {
  // State Logika (Sesuai Versi Web)
  const [hclConcentration, setHclConcentration] = useState('0.1');
  const [hclVolume, setHclVolume] = useState('50');
  const [naohConcentration, setNaohConcentration] = useState('0.1');
  const [naohVolume, setNaohVolume] = useState('50');

  const [totalVolume, setTotalVolume] = useState('?');
  const [molHPlus, setMolHPlus] = useState('?');
  const [molOHMinus, setMolOHMinus] = useState('?');
  const [finalState, setFinalState] = useState('?');
  const [indicatorColor, setIndicatorColor] = useState('#ccc');
  const [simulationStatus, setSimulationStatus] = useState('Siap untuk simulasi.');
  const [isSimulating, setIsSimulating] = useState(false);

  // State Animasi
  const [beakerLiquidHeight] = useState(new Animated.Value(0));
  const [beakerLiquidColor, setBeakerLiquidColor] = useState('#add8e6');
  const [beakerLiquidLevelText, setBeakerLiquidLevelText] = useState('0 mL');

  const startSimulation = async () => {
    const vHcl = parseFloat(hclVolume);
    const vNaoh = parseFloat(naohVolume);
    const mHcl = parseFloat(hclConcentration);
    const mNaoh = parseFloat(naohConcentration);

    if (vHcl === 0 && vNaoh === 0) {
      Alert.alert('Error', 'Mohon masukkan volume HCl atau NaOH.');
      return;
    }

    setIsSimulating(true);
    setSimulationStatus('Menuang Larutan...');

    // Animasi Pengisian Gelas Kimia
    Animated.timing(beakerLiquidHeight, {
      toValue: 120, // Tinggi maksimal cairan di beaker
      duration: ANIMATION_DURATION * 2,
      useNativeDriver: false,
    }).start();

    setBeakerLiquidLevelText(`${vHcl + vNaoh} mL`);
    await new Promise(r => setTimeout(r, ANIMATION_DURATION * 2));

    // Logika Perhitungan Kimia (Sama dengan versi Web)
    const mol_hcl = mHcl * (vHcl / 1000);
    const mol_naoh = mNaoh * (vNaoh / 1000);
    const total_v = vHcl + vNaoh;
    
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

    setTotalVolume(total_v.toFixed(0));
    setMolHPlus(mol_hcl.toExponential(2));
    setMolOHMinus(mol_naoh.toExponential(2));
    setFinalState(state);
    
    const colorIdx = Math.min(Math.max(Math.round(ph), 0), 14);
    setIndicatorColor(phColors[colorIdx]);

    setIsSimulating(false);
    setSimulationStatus('Simulasi selesai.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Card Input */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Input Larutan</Text>
          
          <Text style={styles.inputLabel}>Asam Klorida (HCl)</Text>
          <TextInput 
            style={styles.input} 
            value={hclConcentration} 
            onChangeText={setHclConcentration} 
            keyboardType="numeric" 
            placeholder="Konsentrasi (M)"
          />
          <TextInput 
            style={styles.input} 
            value={hclVolume} 
            onChangeText={setHclVolume} 
            keyboardType="numeric" 
            placeholder="Volume (mL)"
          />

          <Text style={[styles.inputLabel, {marginTop: 10}]}>Natrium Hidroksida (NaOH)</Text>
          <TextInput 
            style={styles.input} 
            value={naohConcentration} 
            onChangeText={setNaohConcentration} 
            keyboardType="numeric" 
            placeholder="Konsentrasi (M)"
          />
          <TextInput 
            style={styles.input} 
            value={naohVolume} 
            onChangeText={setNaohVolume} 
            keyboardType="numeric" 
            placeholder="Volume (mL)"
          />
          
          <TouchableOpacity 
            style={[styles.button, isSimulating && {backgroundColor: '#ccc'}]} 
            onPress={startSimulation}
            disabled={isSimulating}
          >
            <Text style={styles.buttonText}>Mulai Simulasi & Hitung pH</Text>
          </TouchableOpacity>
        </View>

        {/* Card Simulasi */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Simulasi Pencampuran</Text>
          <View style={styles.beakerContainer}>
            <Animated.View style={[styles.liquid, { height: beakerLiquidHeight, backgroundColor: beakerLiquidColor }]} />
            <Text style={styles.liquidLevel}>{beakerLiquidLevelText}</Text>
          </View>
          <Text style={styles.statusText}>{simulationStatus}</Text>
        </View>

        {/* Card Hasil */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hasil & Analisis</Text>
          <View style={styles.resultRow}><Text style={styles.bold}>Total Volume:</Text><Text> {totalVolume} mL</Text></View>
          <View style={styles.resultRow}><Text style={styles.bold}>Mol H⁺ Awal:</Text><Text> {molHPlus} mol</Text></View>
          <View style={styles.resultRow}><Text style={styles.bold}>Mol OH⁻ Awal:</Text><Text> {molOHMinus} mol</Text></View>
          <View style={styles.resultRow}><Text style={styles.bold}>Keadaan Akhir:</Text><Text> {finalState}</Text></View>
          
          <View style={styles.indicatorRow}>
            <Text style={styles.bold}>Warna Indikator: </Text>
            <View style={[styles.colorBox, {backgroundColor: indicatorColor}]} />
          </View>
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' }, // Abu-abu muda agar konsisten
  container: { flex: 1, padding: 15 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1f2937' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#4b5563', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14 },
  button: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  beakerContainer: { 
    height: 150, width: 120, borderWidth: 3, borderColor: '#374151', 
    alignSelf: 'center', justifyContent: 'flex-end', overflow: 'hidden', 
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopWidth: 0
  },
  liquid: { width: '100%' },
  liquidLevel: { textAlign: 'center', fontSize: 12, fontWeight: 'bold', position: 'absolute', width: '100%', bottom: 5, color: '#1f2937' },
  statusText: { textAlign: 'center', marginTop: 15, color: '#6b7280', fontStyle: 'italic' },
  resultRow: { flexDirection: 'row', marginBottom: 8 },
  bold: { fontWeight: '700', color: '#374151' },
  indicatorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  colorBox: { width: 60, height: 25, borderRadius: 5, marginLeft: 10, borderWidth: 1, borderColor: '#ccc' }
});