import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, Pressable } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
// import { Picker } from "@react-native-picker/picker";
import type { View as RNView } from "react-native";
import { useAuth } from "../context/AuthContext"; // Sesuaikan path-nya ya Ken!
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { RefreshCcw } from "lucide-react-native";

const { width } = Dimensions.get("window");
const BEAKER_SIZE = Math.min(90, width / 3.9);

type BeakerKey = "A" | "B" | "C";
type LitmusColor = "Merah" | "Biru";

type Rect = { x: number; y: number; w: number; h: number };

function inside(r: Rect | null, x: number, y: number) {
  if (!r) return false;
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function labelFor(target: BeakerKey, color: LitmusColor) {
  // A = asam: merah tetap merah, biru jadi merah
  // B = basa: merah jadi biru, biru tetap biru
  // C = netral: merah tetap merah, biru tetap biru
  if (target === "A") return color === "Merah" ? "M→M" : "B→M";
  if (target === "B") return color === "Merah" ? "M→B" : "B→B";
  return color === "Merah" ? "M→M" : "B→B";
}

function miniBg(lbl: string) {
  return lbl.endsWith("M") ? "#ef4444" : "#3b82f6";
}

function DraggableLakmus({
  color,
  onDrop,
}: {
  color: LitmusColor;
  onDrop: (absX: number, absY: number, color: LitmusColor) => void;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const z = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      z.value = 999;
    })
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      runOnJS(onDrop)(e.absoluteX, e.absoluteY, color);

      // balik halus TANPA bounce
      tx.value = withTiming(0, { duration: 160 });
      ty.value = withTiming(0, { duration: 160 });
      z.value = 1;
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
    zIndex: z.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.lakmus, color === "Merah" ? styles.red : styles.blue, style]}>
        <Text style={styles.lakmusText}>{color.toUpperCase()}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function KesimpulanDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const options = ["Asam", "Basa", "Netral"];

  return (
    <View style={{ width: "100%" }}>
      {/* Trigger */}
      <Pressable
        style={styles.dropdownTrigger}
        onPress={() => setOpen((p) => !p)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {value || "Pilih Kesimpulan"}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      {/* Options */}
      {open && (
        <View style={styles.dropdownMenu}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}


export default function LatihanBab1() {
  const { currentUser, userScores, refreshUserScores } = useAuth() as any;
  const [conclusions, setConclusions] = useState<Record<BeakerKey, string>>({ A: "", B: "", C: "" });
  const [testResults, setTestResults] = useState<Record<BeakerKey, string[]>>({ A: [], B: [], C: [] });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  // refs untuk measureInWindow (ini kunci biar drop-nya akurat)
  const refA = useRef<RNView | null>(null);
  const refB = useRef<RNView | null>(null);
  const refC = useRef<RNView | null>(null);

  const [selectedLakmus, setSelectedLakmus] = useState<"Merah" | "Biru">("Merah");

  const handleReset = () => {
    setTestResults({ A: [], B: [], C: [] });
    setConclusions({ A: "", B: "", C: "" });
    setIsSubmitted(false);
    setQuizResult(null);
  };

  const rectRef = useRef<Record<BeakerKey, Rect | null>>({ A: null, B: null, C: null });

  const measureBeakers = useCallback(() => {
    // ✅ helper menerima nullable
    const measureOne = (key: BeakerKey, r: React.RefObject<RNView | null>) => {
      r.current?.measureInWindow((x, y, w, h) => {
        rectRef.current[key] = { x, y, w, h };
      });
    };

    measureOne("A", refA);
    measureOne("B", refB);
    measureOne("C", refC);
  }, []);

  const handleSubmit = async () => {
    const kunci = { A: "Asam", B: "Basa", C: "Netral" };
    let benar = 0;

    // Hitung skor berdasarkan dropdown yang dipilih Ken
    if (conclusions.A === kunci.A) benar++;
    if (conclusions.B === kunci.B) benar++;
    if (conclusions.C === kunci.C) benar++;

    const finalScore = Math.round((benar / 3) * 100);

    // LOGIKA SIMPAN KE FIREBASE (Mirip Bab 2) ✨
    if (currentUser?.uid) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        await setDoc(
          userRef,
          { Bab1Score: finalScore},
          { merge: true }
        );
        if (typeof refreshUserScores === "function") {
          await refreshUserScores();
        }
      } catch (error) {
        console.error("Gagal menyimpan skor Bab 1:", error);
      }
    }

    // Set status untuk munculin kotak hasil
    setQuizResult({
      score: finalScore,
      correctAssociations: benar,
      maxAssociations: 3,
    });
    setIsSubmitted(true);
  };

  const onDrop = useCallback(
    (absX: number, absY: number, color: LitmusColor) => {
      // pastikan rect terbaru
      measureBeakers();

      const r = rectRef.current;
      let target: BeakerKey | null = null;

      if (inside(r.A, absX, absY)) target = "A";
      else if (inside(r.B, absX, absY)) target = "B";
      else if (inside(r.C, absX, absY)) target = "C";

      if (!target) return;

      const lbl = labelFor(target, color);
      setTestResults((prev) => ({
        ...prev,
        [target!]: [...prev[target!], lbl].slice(-2),
      }));
    },
    [measureBeakers]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} onLayout={measureBeakers}>
      
        {/* BAR LAKMUS (di atas beaker) */}
        <View style={styles.lakmusBar}>
          <Text style={styles.lakmusBarLabel}>Lakmus:</Text>
          
          <View style={styles.pillContainer}>
             <DraggableLakmus color="Merah" onDrop={onDrop} />
             <DraggableLakmus color="Biru" onDrop={onDrop} />
          </View>
        </View>


        <View style={styles.beakerRow}>
          {/* A */}
          <View style={styles.beakerWrapper}>
            <View ref={refA} style={styles.beaker}>
              <Text style={styles.beakerLabel}>A</Text>
              <View style={styles.resultContainer}>
                {testResults.A.map((res, i) => (
                  <View key={`A-${i}`} style={[styles.miniLakmus, { backgroundColor: miniBg(res) }]}>
                    <Text style={styles.miniText}>{res}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.pickerWrap}>

              <KesimpulanDropdown
                value={conclusions.A}
                onChange={(val) =>
                  setConclusions((p) => ({ ...p, A: val }))
                }
              />
            </View>

            {/* <Text style={styles.subText}>Larutan A</Text> */}
          </View>

          {/* B */}
          <View style={styles.beakerWrapper}>
            <View ref={refB} style={styles.beaker}>
              <Text style={styles.beakerLabel}>B</Text>
              <View style={styles.resultContainer}>
                {testResults.B.map((res, i) => (
                  <View key={`B-${i}`} style={[styles.miniLakmus, { backgroundColor: miniBg(res) }]}>
                    <Text style={styles.miniText}>{res}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.pickerWrap}>
              {/* <Text style={styles.pickerTitle}>Kesimpulan</Text> */}

              <KesimpulanDropdown
                value={conclusions.B}
                onChange={(val) =>
                  setConclusions((p) => ({ ...p, B: val }))
                }
              />
            </View>

            {/* <Text style={styles.subText}>Larutan B</Text> */}
          </View>

          {/* C */}
          <View style={styles.beakerWrapper}>
            <View ref={refC} style={styles.beaker}>
              <Text style={styles.beakerLabel}>C</Text>
              <View style={styles.resultContainer}>
                {testResults.C.map((res, i) => (
                  <View key={`C-${i}`} style={[styles.miniLakmus, { backgroundColor: miniBg(res) }]}>
                    <Text style={styles.miniText}>{res}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.pickerWrap}>
              {/* <Text style={styles.pickerTitle}>Kesimpulan</Text> */}

              <KesimpulanDropdown
                value={conclusions.C}
                onChange={(val) =>
                  setConclusions((p) => ({ ...p, C: val }))
                }
              />
            </View>

            {/* <Text style={styles.subText}>Larutan C</Text> */}
          </View>
        </View>

        {/* <View style={styles.dragZone}>
          <Text style={styles.hint}>Tarik kertas lakmus ke arah gelas:</Text>
          <View style={styles.lakmusGroup}>
            <DraggableLakmus color="Biru" onDrop={onDrop} />
            <DraggableLakmus color="Merah" onDrop={onDrop} />
          </View>
        </View> */}

        {/* <Pressable
          style={styles.btnCek}
          onPress={() => Alert.alert("Tersimpan!", "Jawaban kamu sudah dicatat Ken!")}
        >
          <Text style={styles.btnText}>Simpan Hasil</Text>
        </Pressable> */}

        {/* BUTTON ROW */}
        {/* <View style={styles.actionRow}>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => Alert.alert("Cek Kesimpulan", "Nanti di sini kamu bisa validasi jawaban 😊")}
          >
            <Text style={styles.btnPrimaryText}>Cek Kesimpulan</Text>
          </Pressable>

          <Pressable
            style={styles.btnSecondary}
            onPress={() => {
              setTestResults({ A: [], B: [], C: [] });
              setConclusions({ A: "", B: "", C: "" });
            }}
          >
            <Text style={styles.btnSecondaryText}>Ulangi Simulasi</Text>
          </Pressable>
        </View> */}

        {/* RESULT BLOCK ✨ */}
        <View style={styles.resultBlock}>
          {quizResult && (
            <View style={[styles.resultBox, quizResult.score === 100 ? styles.resultGreen : styles.resultBlue]}>
              <Text style={styles.resultTitle}>
                {quizResult.score === 100 ? "SELAMAT! SKOR SEMPURNA!" : "Hasil Latihanmu"}
              </Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultScore}>{quizResult.score} / 100</Text>
                <Text style={styles.resultMeta}>
                  ({quizResult.correctAssociations} / {quizResult.maxAssociations})
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitted}
              style={[styles.primaryBtn, isSubmitted && styles.btnDisabled]}
            >
              <Text style={styles.primaryBtnText}>
                {isSubmitted ? "Jawaban Terkunci" : "Cek Kesimpulan"}
              </Text>
            </Pressable>

            <Pressable onPress={handleReset} style={styles.secondaryBtn}>
              <RefreshCcw size={16} color="#374151" />
              <Text style={styles.secondaryBtnText}>Ulangi</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", alignItems: "center", paddingTop: 26 },
  screenTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "900", marginBottom: 14 },

  beakerRow: { flexDirection: "row", justifyContent: "space-between", width: "94%" },
  beakerWrapper: { width: "32%", alignItems: "center" },

  beaker: {
    width: BEAKER_SIZE,
    height: BEAKER_SIZE * 1.35,
    borderWidth: 2,
    borderColor: "#10b981",
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  beakerLabel: { position: "absolute", top: 8, fontWeight: "900", color: "#6b7280" },

  resultContainer: { alignItems: "center", gap: 6 },
  miniLakmus: { width: 54, height: 22, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  miniText: { color: "#fff", fontSize: 11, fontWeight: "900" },

  pickerWrap: { width: "100%", marginTop: 10 },
  pickerTitle: { fontSize: 11, fontWeight: "800", color: "#374151", marginBottom: 6, alignSelf: "flex-start" },
  pickerBorder: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#3b82f6",
    borderRadius: 10,
    backgroundColor: "#f0f9ff",
    overflow: "hidden",
  },
  picker: { width: "100%", height: 44 },

  subText: { marginTop: 6, fontSize: 13, fontWeight: "900", color: "#111827" },

  dragZone: { marginTop: 18, alignItems: "center", width: "100%" },
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 14 },

  lakmusGroup: { flexDirection: "row", gap: 30 },
  lakmus: { width: 90, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", elevation: 10 },
  red: { backgroundColor: "#ef4444" },
  blue: { backgroundColor: "#0062ffff" },
  lakmusText: { color: "#fff", fontWeight: "900", fontSize: 12, letterSpacing: 0.4 },

  btnCek: {
    marginTop: 18,
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 58,
    borderRadius: 999,
  },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  dropdownTrigger: {
    height: 44,
    borderWidth: 1.5,
    borderColor: "#0062ffff",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingLeft: 8,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#111827",
  },

  placeholder: {
    color: "#9ca3af",
  },

  arrow: {
    fontSize: 12,
    color: "#374151",
  },

  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: "#3b82f6",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 6,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  // ===== LAKMUS BAR (WEB-LIKE) =====
  lakmusBar: {
    width: "100%",
    backgroundColor: "#FEFCE8",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end', // Biar lakmusnya geser ke kanan
    gap: 17,
    marginBottom: 14,
    zIndex: 10, // Biar pas di-drag lakmusnya ada di depan gelas
  },
  lakmusBarLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    marginRight: 4,
  },
  lakmusPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 2,
  },
  lakmusPillRed: {
    backgroundColor: "#ff0000ff",
  },
  lakmusPillBlue: {
    backgroundColor: "#0051ffff",
  },
  lakmusPillActive: {
    transform: [{ scale: 1.02 }],
  },
  lakmusPillText: {
    color: "white",
    fontWeight: "900",
    fontSize: 12,
  },

  // ===== BUTTON ROW (WEB-LIKE) =====
  actionRow: {
    marginTop: 16,
    width: "100%",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 4,
  },
  btnPrimaryText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },
  btnSecondary: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  btnSecondaryText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 13,
  },
  pillContainer: {
    flexDirection: "row",
    gap: 15,
    flex: 1,
  },
  resultBlock: { marginTop: 20, width: '94%', gap: 12 },
  resultBox: { padding: 15, borderRadius: 15, borderWidth: 2 },
  resultGreen: { backgroundColor: "#ECFDF5", borderColor: "#10b981" },
  resultBlue: { backgroundColor: "#EFF6FF", borderColor: "#3b82f6" },
  resultTitle: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 5 },
  resultRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  resultScore: { fontSize: 24, fontWeight: "900", color: "#2563eb" },
  resultMeta: { color: "#4b5563", fontSize: 14 },
  actions: { flexDirection: "row", gap: 10, marginTop: 10 },
  primaryBtn: { flex: 1, backgroundColor: "#2563eb", padding: 15, borderRadius: 12, alignItems: "center" },
  primaryBtnText: { color: "white", fontWeight: "800" },
  btnDisabled: { backgroundColor: "#9ca3af" },
  secondaryBtn: { flexDirection: "row", gap: 8, backgroundColor: "#e5e7eb", padding: 15, borderRadius: 12, alignItems: "center" },
  secondaryBtnText: { fontWeight: "700", color: "#374151" },
});
