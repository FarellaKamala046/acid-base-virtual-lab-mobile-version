import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, TextInput, SafeAreaView, Easing } from "react-native";

const ANIMATION_DURATION = 1100;

const phColors = [
  "#ff0000",
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#adff2f",
  "#7fff00",
  "#00ff00",
  "#32cd32",
  "#00fa9a",
  "#00ffff",
  "#1e90ff",
  "#0000ff",
  "#4b0082",
  "#8b00ff",
  "#9400d3",
];

const MAX_VISUAL_TUBE_ML = 100;
const MIN_VISUAL_BEAKER_CAPACITY_ML = 200;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function phToColor(pH: number) {
  const idx = clamp(Math.round(pH), 0, 14);
  return phColors[idx];
}

export default function VirtualLab() {
  const [hclConcentration, setHclConcentration] = useState("0.1");
  const [hclVolume, setHclVolume] = useState("50");
  const [naohConcentration, setNaohConcentration] = useState("0.1");
  const [naohVolume, setNaohVolume] = useState("50");

  const [totalVolume, setTotalVolume] = useState("?");
  const [molHPlus, setMolHPlus] = useState("?");
  const [molOHMinus, setMolOHMinus] = useState("?");
  const [finalState, setFinalState] = useState("?");
  const [indicatorColor, setIndicatorColor] = useState("#ccc");
  const [simulationStatus, setSimulationStatus] = useState("Siap untuk simulasi");
  const [isSimulating, setIsSimulating] = useState(false);

  const [finalPh, setFinalPh] = useState("?");
  const acidPour = useRef(new Animated.Value(0)).current;
  const basePour = useRef(new Animated.Value(0)).current;
  const tubeAcidFill = useRef(new Animated.Value(1)).current;
  const tubeBaseFill = useRef(new Animated.Value(1)).current;
  const beakerFill = useRef(new Animated.Value(0)).current;
  const [beakerLiquidColor, setBeakerLiquidColor] = useState("#add8e6");
  const [beakerLiquidLevelText, setBeakerLiquidLevelText] = useState("0 mL");
  const tubeAcidColor = "#ff9999";
  const tubeBaseColor = "#99ccff";

  const parsed = useMemo(() => {
    const vHcl = parseFloat(hclVolume);
    const vNaoh = parseFloat(naohVolume);
    const mHcl = parseFloat(hclConcentration);
    const mNaoh = parseFloat(naohConcentration);

    return {
      vHcl: Number.isFinite(vHcl) ? vHcl : NaN,
      vNaoh: Number.isFinite(vNaoh) ? vNaoh : NaN,
      mHcl: Number.isFinite(mHcl) ? mHcl : NaN,
      mNaoh: Number.isFinite(mNaoh) ? mNaoh : NaN,
    };
  }, [hclVolume, naohVolume, hclConcentration, naohConcentration]);

  const currentBeakerFracRef = useRef(0);

  const setInitialVisualFills = (vHcl: number, vNaoh: number) => {
    const acidFrac = clamp(vHcl / MAX_VISUAL_TUBE_ML, 0, 1);
    const baseFrac = clamp(vNaoh / MAX_VISUAL_TUBE_ML, 0, 1);

    tubeAcidFill.setValue(acidFrac);
    tubeBaseFill.setValue(baseFrac);

    acidPour.setValue(0);
    basePour.setValue(0);

    beakerFill.setValue(0);
    currentBeakerFracRef.current = 0;

    setBeakerLiquidColor("#add8e6");
    setBeakerLiquidLevelText("0 mL");
  };

  const runPourAnimation = async (
    which: "acid" | "base",
    mlToPour: number,
    beakerCapacityMl: number,
    shownMlLabel: number
  ) => {
    const pour = which === "acid" ? acidPour : basePour;
    const tubeFill = which === "acid" ? tubeAcidFill : tubeBaseFill;
    const startFrac = clamp(mlToPour / MAX_VISUAL_TUBE_ML, 0, 1);
    tubeFill.setValue(startFrac);

    const addFrac = clamp(mlToPour / beakerCapacityMl, 0, 1);
    const nextBeaker = clamp(currentBeakerFracRef.current + addFrac, 0, 1);

    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(pour, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(tubeFill, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(beakerFill, {
          toValue: nextBeaker,
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start(() => {
        currentBeakerFracRef.current = nextBeaker;

        Animated.timing(pour, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          setBeakerLiquidLevelText(`${shownMlLabel.toFixed(0)} mL`);
          resolve();
        });
      });
    });
  };

  const autoResetVisuals = async (vHcl: number, vNaoh: number) => {
    const acidFrac = clamp(vHcl / MAX_VISUAL_TUBE_ML, 0, 1);
    const baseFrac = clamp(vNaoh / MAX_VISUAL_TUBE_ML, 0, 1);

    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(beakerFill, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(tubeAcidFill, {
          toValue: acidFrac,
          duration: 650,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(tubeBaseFill, {
          toValue: baseFrac,
          duration: 650,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start(() => {
        currentBeakerFracRef.current = 0;
        setBeakerLiquidColor("#add8e6");
        setBeakerLiquidLevelText("0 mL");
        resolve();
      });
    });
  };

  const startSimulation = async () => {
    const { vHcl, vNaoh, mHcl, mNaoh } = parsed;

    if (
      !Number.isFinite(vHcl) ||
      !Number.isFinite(vNaoh) ||
      !Number.isFinite(mHcl) ||
      !Number.isFinite(mNaoh) ||
      vHcl < 0 ||
      vNaoh < 0 ||
      mHcl < 0 ||
      mNaoh < 0
    ) {
      Alert.alert("Error", "Mohon masukkan konsentrasi & volume yang valid (angka ≥ 0).");
      return;
    }

    if (vHcl === 0 && vNaoh === 0) {
      Alert.alert("Error", "Mohon masukkan volume HCl atau NaOH.");
      return;
    }

    setIsSimulating(true);
    setSimulationStatus("Menyiapkan simulasi...");

    setInitialVisualFills(vHcl, vNaoh);

    const totalMl = vHcl + vNaoh;

    const beakerCapacityMl = Math.max(totalMl, MIN_VISUAL_BEAKER_CAPACITY_ML);

    if (vHcl > 0) {
      setSimulationStatus("Menuang HCl...");
      setBeakerLiquidColor(tubeAcidColor);
      await runPourAnimation("acid", vHcl, beakerCapacityMl, vHcl);
    }

    if (vNaoh > 0) {
      setSimulationStatus("Menuang NaOH...");
      setBeakerLiquidColor(tubeBaseColor);
      await runPourAnimation("base", vNaoh, beakerCapacityMl, totalMl);
    }

    setSimulationStatus("Menghitung hasil...");

    const mol_hcl = mHcl * (vHcl / 1000);
    const mol_naoh = mNaoh * (vNaoh / 1000);
    const total_L = totalMl / 1000;

    let ph = 7;
    let state = "Larutan bersifat Netral";

    if (mol_hcl > mol_naoh) {
      const h_plus = (mol_hcl - mol_naoh) / total_L;
      ph = -Math.log10(h_plus);
      state = "Larutan bersifat Asam";
      setBeakerLiquidColor("#ff9999");
    } else if (mol_naoh > mol_hcl) {
      const oh_minus = (mol_naoh - mol_hcl) / total_L;
      const pOH = -Math.log10(oh_minus);
      ph = 14 - pOH;
      state = "Larutan bersifat Basa";
      setBeakerLiquidColor("#99ccff");
    } else {
      ph = 7;
      state = "Larutan bersifat Netral";
      setBeakerLiquidColor("lightgray");
    }

    ph = clamp(ph, 0, 14);

    setTotalVolume(totalMl.toFixed(0));
    setMolHPlus(mol_hcl.toExponential(2));
    setMolOHMinus(mol_naoh.toExponential(2));
    setFinalState(state);
    setIndicatorColor(phToColor(ph));

    setFinalPh(ph.toFixed(2));

    setBeakerLiquidLevelText(`${totalMl.toFixed(0)} mL`);

    setSimulationStatus("Simulasi selesai");
    setIsSimulating(false);

    await autoResetVisuals(vHcl, vNaoh);
  };

  const resetLab = () => {
    if (isSimulating) return;

    setHclConcentration("0.1");
    setHclVolume("50");
    setNaohConcentration("0.1");
    setNaohVolume("50");

    setTotalVolume("?");
    setMolHPlus("?");
    setMolOHMinus("?");
    setFinalState("?");
    setIndicatorColor("#ccc");
    setSimulationStatus("Siap untuk simulasi");
    setFinalPh("?");

    acidPour.setValue(0);
    basePour.setValue(0);
    tubeAcidFill.setValue(1);
    tubeBaseFill.setValue(1);

    beakerFill.setValue(0);
    currentBeakerFracRef.current = 0;

    setBeakerLiquidColor("#add8e6");
    setBeakerLiquidLevelText("0 mL");
  };

  const acidTransform = {
    transform: [
      {
        translateX: acidPour.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -22],
        }),
      },
      {
        translateY: acidPour.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
      {
        rotate: acidPour.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "80deg"],
        }),
      },
    ],
  };

  const baseTransform = {
    transform: [
      {
        translateX: basePour.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 22],
        }),
      },
      {
        translateY: basePour.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
      {
        rotate: basePour.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "-80deg"],
        }),
      },
    ],
  };

  const tubeLiquidHeight = (fill: Animated.Value) =>
    fill.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150],
      extrapolate: "clamp",
    });

  const beakerLiquidHeight = beakerFill.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Input Larutan</Text>

          <Text style={styles.inputLabel}>Asam Klorida (HCl)</Text>
          <Text style={styles.fieldLabel}>Konsentrasi HCl (M):</Text>
          <TextInput
            style={styles.input}
            value={hclConcentration}
            onChangeText={setHclConcentration}
            keyboardType="numeric"
          />
          <Text style={styles.fieldLabel}>Volume HCl (mL):</Text>
          <TextInput
            style={styles.input}
            value={hclVolume}
            onChangeText={setHclVolume}
            keyboardType="numeric"
          />

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Natrium Hidroksida (NaOH)</Text>
          <Text style={styles.fieldLabel}>Konsentrasi NaOH (M):</Text>
          <TextInput
            style={styles.input}
            value={naohConcentration}
            onChangeText={setNaohConcentration}
            keyboardType="numeric"
          />
          <Text style={styles.fieldLabel}>Volume NaOH (mL):</Text>
          <TextInput
            style={styles.input}
            value={naohVolume}
            onChangeText={setNaohVolume}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.button, isSimulating && { backgroundColor: "#ccc" }]}
            onPress={startSimulation}
            disabled={isSimulating}
          >
            <Text style={styles.buttonText}>Mulai Simulasi & Hitung pH</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonSecondary, isSimulating && { backgroundColor: "#e5e7eb" }]}
            onPress={resetLab}
            disabled={isSimulating}
          >
            <Text style={styles.buttonSecondaryText}>Reset Lab</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Simulasi Pencampuran</Text>

          <View style={styles.tubesRow}>
            <View style={styles.tubeCol}>
              <Animated.View style={[styles.tubeWrap, acidTransform]}>
                <View style={styles.tubeGlass}>
                  <Animated.View
                    style={[
                      styles.tubeLiquid,
                      { height: tubeLiquidHeight(tubeAcidFill), backgroundColor: tubeAcidColor },
                    ]}
                  />
                </View>
              </Animated.View>
              <Text style={styles.tubeLabel}>HCl</Text>
            </View>

            <View style={styles.tubeCol}>
              <Animated.View style={[styles.tubeWrap, baseTransform]}>
                <View style={styles.tubeGlass}>
                  <Animated.View
                    style={[
                      styles.tubeLiquid,
                      { height: tubeLiquidHeight(tubeBaseFill), backgroundColor: tubeBaseColor },
                    ]}
                  />
                </View>
              </Animated.View>
              <Text style={styles.tubeLabel}>NaOH</Text>
            </View>
          </View>

          <View style={styles.beakerOuter}>
            <View style={styles.beakerInner}>
              <Animated.View
                style={[
                  styles.beakerLiquid,
                  { height: beakerLiquidHeight, backgroundColor: beakerLiquidColor },
                ]}
              />
              <Text style={styles.beakerLevel}>{beakerLiquidLevelText}</Text>
            </View>
          </View>

          <Text style={styles.statusText}>{simulationStatus}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hasil & Analisis</Text>

          <View style={styles.resultRow}>
            <Text style={styles.bold}>pH Akhir:</Text>
            <Text> {finalPh}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.bold}>Total Volume:</Text>
            <Text> {totalVolume} mL</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.bold}>Mol H⁺ Awal:</Text>
            <Text> {molHPlus} mol</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.bold}>Mol OH⁻ Awal:</Text>
            <Text> {molOHMinus} mol</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.bold}>Keadaan Akhir:</Text>
            <Text> {finalState}</Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.bold}>Warna Indikator Universal:</Text>
            <View style={[styles.colorBox, { backgroundColor: indicatorColor }]} />
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={styles.cardTitle}>Penjelasan Konsep:</Text>

            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>Perhitungan pH: </Text>
                pH dihitung berdasarkan konsentrasi ion yang tersisa setelah reaksi netralisasi.
              </Text>
            </View>

            <View style={{ marginLeft: 18, marginTop: 6 }}>
              <Text style={styles.subLine}>Jika larutan bersifat asam (H⁺ berlebih):</Text>
              <Text style={styles.subLine}>pH = −log₁₀ [H⁺]</Text>

              <Text style={[styles.subLine, { marginTop: 6 }]}>Jika larutan bersifat basa (OH⁻ berlebih):</Text>
              <Text style={styles.subLine}>pOH = −log₁₀ [OH⁻]</Text>
              <Text style={styles.subLine}>pH = 14 − pOH</Text>
            </View>

            <View style={[styles.bulletRow, { marginTop: 8 }]}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>Larutan Netral: </Text>
                Terjadi ketika jumlah mol ion H⁺ sama dengan jumlah mol ion OH⁻. Seluruh ion H⁺ dan OH⁻ bereaksi habis
                membentuk air (H₂O), sehingga tidak ada kelebihan asam maupun basa.
              </Text>
            </View>

            <View style={{ marginLeft: 18, marginTop: 6 }}>
              <Text style={styles.subLine}>Pada kondisi ini, nilai pH larutan adalah:</Text>
              <Text style={[styles.subLine, { marginLeft: 1, marginTop: 4 }]}>pH = 7</Text>

              <Text style={[styles.subLine, { marginTop: 6 }]}>
                Contoh: 50 mL 0.1 M HCl dicampur dengan 50 mL 0.1 M NaOH. Karena mol H⁺ = mol OH⁻, larutan bersifat
                netral dan indikator universal menunjukkan warna hijau.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>Asam Kuat (HCl) & Basa Kuat (NaOH): </Text>
                Berdisosiasi sempurna dalam air.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>Stoikiometri: </Text>
                Jumlah mol (n) dihitung dari konsentrasi (M) dan volume (V) dalam Liter: n = M * V.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>Netralisasi: </Text>
                Ion H⁺ dari asam bereaksi dengan ion OH⁻ dari basa membentuk air (H₂O). Jumlah Jumlah mol yang berlebih
                (H⁺ atau OH⁻) menentukan sifat akhir larutan.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>pH: </Text>
                Ukuran keasaman atau kebasaan larutan.
              </Text>
            </View>

            <View style={{ marginLeft: 18, marginTop: 6 }}>
              <Text style={styles.subLine}>pH &lt; 7: Asam</Text>
              <Text style={styles.subLine}>pH = 7: Netral</Text>
              <Text style={styles.subLine}>pH &gt; 7: Basa</Text>
            </View>

            <View style={[styles.bulletRow, { marginTop: 10 }]}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldInline}>Indikator Universal: </Text>
                Berubah warna sesuai dengan rentang pH larutan.
              </Text>
            </View>

            <Text style={[styles.cardTitle, { marginTop: 18 }]}>Eksperimen:</Text>

            <View style={styles.numberRow}>
              <Text style={styles.num}>1.</Text>
              <Text style={styles.numberText}>
                Coba campurkan volume dan konsentrasi yang sama (misal: 50 mL 0.1 M HCl dengan 50 mL 0.1 M NaOH). Apa
                yang terjadi?
              </Text>
            </View>

            <View style={styles.numberRow}>
              <Text style={styles.num}>2.</Text>
              <Text style={styles.numberText}>
                Buat larutan asam (misal: 100 mL 0.1 M HCl dengan 20 mL 0.1 M NaOH). Cek pH dan warna.
              </Text>
            </View>

            <View style={styles.numberRow}>
              <Text style={styles.num}>3.</Text>
              <Text style={styles.numberText}>
                Buat larutan basa (misal: 20 mL 0.1 M HCl dengan 100 mL 0.1 M NaOH). Cek pH dan warna.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GLASS = "#374151";
const GLASS_SOFT = "#CBD5E1";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  container: { flex: 1, padding: 15 },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#1f2937" },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#4b5563", marginBottom: 5 },

  fieldLabel: { fontSize: 14, color: "#111827", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },

  button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  buttonSecondary: {
    backgroundColor: "#e5e7eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonSecondaryText: { color: "#374151", fontWeight: "700", fontSize: 16 },

  tubesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  tubeCol: { alignItems: "center", width: 120 },
  tubeWrap: { width: 90, height: 180, alignItems: "center", justifyContent: "flex-end" },
  tubeLabel: { marginTop: 10, fontWeight: "800", fontSize: 18, color: "#111827" },
  tubeGlass: {
    width: 70,
    height: 170,
    borderWidth: 3,
    borderColor: GLASS_SOFT,
    borderTopWidth: 0,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  tubeLiquid: {
    width: "100%",
  },
  beakerOuter: {
    alignSelf: "center",
    width: 190,
    height: 240,
    borderWidth: 4,
    borderColor: GLASS,
    borderTopWidth: 0,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: "transparent",
  },
  beakerInner: {
    flex: 1,
    overflow: "hidden",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  beakerLiquid: {
    width: "100%",
  },
  beakerLevel: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 20,
    color: "#111827",
  },

  statusText: { textAlign: "center", marginTop: 15, color: "#6b7280", fontStyle: "italic", fontSize: 18 },
  resultRow: { flexDirection: "row", marginBottom: 8 },
  bold: { fontWeight: "700", color: "#374151" },

  colorBox: {
    width: "100%",
    height: 60,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 8 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 6 },
  bulletDot: { width: 18, fontSize: 16, lineHeight: 22, color: "#111827" },
  bulletText: { flex: 1, fontSize: 15, lineHeight: 22, color: "#111827" },
  boldInline: { fontWeight: "800", color: "#111827" },
  subLine: { fontSize: 15, lineHeight: 22, color: "#111827", marginTop: 2 },
  numberRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  num: { width: 22, fontSize: 15, lineHeight: 22, fontWeight: "700", color: "#111827" },
  numberText: { flex: 1, fontSize: 15, lineHeight: 22, color: "#111827" },
});
