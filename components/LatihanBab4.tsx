import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Check, RefreshCcw, X } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// --- Assets ---
import imgBuret from "../assets/images/buret.png";
import imgErlenmeyer from "../assets/images/erlenmeyer.png";
import imgGelasKimia from "../assets/images/gelas-kimia.png";
import imgPipetTetes from "../assets/images/pipet-tetes.png";
import imgPipetVolume from "../assets/images/pipet-volume.png";
import imgStatif from "../assets/images/statif.png";

const EQUIPMENT_LIST = [
  { id: "alat_buret", name: "Buret", image: imgBuret },
  { id: "alat_erlenmeyer", name: "Labu Erlenmeyer", image: imgErlenmeyer },
  { id: "alat_gelas_kimia", name: "Gelas Kimia", image: imgGelasKimia },
  { id: "alat_pipet_tetes", name: "Pipet Tetes", image: imgPipetTetes },
  { id: "alat_pipet_volume", name: "Pipet Volume", image: imgPipetVolume },
  { id: "alat_statif", name: "Statif", image: imgStatif },
];

export default function LatihanBab4() {
  const { currentUser, userScores, refreshUserScores } = useAuth() as any;

  const [droppedLabels, setDroppedLabels] = useState<Record<string, string>>({});
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; correct: number; total: number } | null>(null);

  const shuffledEquipment = useMemo(() => [...EQUIPMENT_LIST].sort(() => Math.random() - 0.5), []);
  const allLabels = useMemo(() => EQUIPMENT_LIST.map(item => ({ id: item.id, name: item.name })), []);

  const handlePlaceLabel = (equipmentId: string) => {
    if (isSubmitted || !selectedLabelId) return;

    const newDropped = { ...droppedLabels };
    // Bersihkan jika label ini sudah ada di tempat lain
    Object.keys(newDropped).forEach(key => {
      if (newDropped[key] === selectedLabelId) delete newDropped[key];
    });

    setDroppedLabels({ ...newDropped, [equipmentId]: selectedLabelId });
    setSelectedLabelId(null);
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    EQUIPMENT_LIST.forEach((item) => {
      if (droppedLabels[item.id] === item.id) correctCount++;
    });

    const finalScore = Math.round((correctCount / EQUIPMENT_LIST.length) * 100);

    if (currentUser?.uid) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        await setDoc(userRef, { Bab4Score: finalScore }, { merge: true });
        await refreshUserScores?.();
      } catch (e) { console.error(e); }
    }

    setIsSubmitted(true);
    setQuizResult({ score: finalScore, correct: correctCount, total: EQUIPMENT_LIST.length });
  };

  const handleReset = () => {
    setDroppedLabels({});
    setSelectedLabelId(null);
    setIsSubmitted(false);
    setQuizResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.h2}>Latihan Mengenal Alat Laboratorium</Text>
      <Text style={styles.p}>Cara main: Pilih nama alat di bawah, lalu tap kotak gambar yang sesuai.</Text> */}

      {/* Grid Alat */}
      <View style={styles.grid}>
        {shuffledEquipment.map((item) => {
          const droppedLabelId = droppedLabels[item.id];
          const droppedLabelName = allLabels.find(l => l.id === droppedLabelId)?.name;
          const isCorrect = isSubmitted ? droppedLabelId === item.id : null;

          return (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.7}
              onPress={() => handlePlaceLabel(item.id)}
              style={[
                styles.card,
                isCorrect === true && styles.cardCorrect,
                isCorrect === false && styles.cardIncorrect
              ]}
            >
              <View style={styles.imageBox}>
                <Image source={item.image} style={styles.imageAlat} resizeMode="contain" />
              </View>
              <View style={styles.labelDropZone}>
                {droppedLabelName ? (
                  <Text style={[styles.droppedText, isSubmitted && (isCorrect ? styles.textCorrect : styles.textIncorrect)]}>
                    {droppedLabelName}
                  </Text>
                ) : (
                  <Text style={styles.hintText}>Tap di sini</Text>
                )}
                {isSubmitted && (
                  <View style={styles.iconPos}>
                    {isCorrect ? <Check size={14} color="green" /> : <X size={14} color="red" />}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Area Pilihan Label */}
      <View style={styles.labelBank}>
        <Text style={styles.bankTitle}>Pilih Nama Alat:</Text>
        <View style={styles.bankGrid}>
          {allLabels.map((label) => {
            const isUsed = Object.values(droppedLabels).includes(label.id);
            const isSelected = selectedLabelId === label.id;
            return (
              <TouchableOpacity
                key={label.id}
                disabled={isSubmitted || isUsed}
                onPress={() => setSelectedLabelId(label.id)}
                style={[
                  styles.labelBtn,
                  isSelected && styles.labelBtnActive,
                  isUsed && styles.labelBtnUsed
                ]}
              >
                <Text style={[styles.labelText, isSelected && styles.labelTextActive, isUsed && styles.labelTextUsed]}>
                  {label.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Hasil & Tombol */}
      {quizResult && (
        <View style={[styles.resultBox, quizResult.score === 100 ? styles.resGreen : styles.resBlue]}>
          <Text style={styles.resTitle}>Hasil Tebak Alat:</Text>
          <Text style={styles.resScore}>{quizResult.score} / 100</Text>
          <Text style={styles.resMeta}>({quizResult.correct} benar dari {quizResult.total})</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.btnPrimary, (isSubmitted || Object.keys(droppedLabels).length < 6) && styles.btnDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitted || Object.keys(droppedLabels).length < 6}
        >
          <Text style={styles.btnPrimaryText}>{isSubmitted ? "Jawaban Terkunci" : "Cek Jawaban"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={handleReset}>
          <RefreshCcw size={16} color="#374151" />
          <Text style={styles.btnSecondaryText}>Ulangi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 50 },
  h2: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 8 },
  p: { fontSize: 13, color: "#6B7280", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 15, borderWidth: 1.5, borderColor: "#DBEAFE", marginBottom: 15, overflow: "hidden", elevation: 2 },
  cardCorrect: { borderColor: "#86efac", backgroundColor: "#f0fdf4" },
  cardIncorrect: { borderColor: "#fca5a5", backgroundColor: "#fef2f2" },
  imageBox: { height: 100, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center", padding: 10 },
  imageAlat: { width: "100%", height: "100%" },
  labelDropZone: { height: 45, justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderTopColor: "#E2E8F0", paddingHorizontal: 5 },
  droppedText: { fontSize: 12, fontWeight: "700", color: "#1E40AF", textAlign: "center" },
  textCorrect: { color: "#166534" },
  textIncorrect: { color: "#991b1b" },
  hintText: { fontSize: 11, color: "#94a3b8", fontStyle: "italic" },
  iconPos: { position: "absolute", top: 2, right: 4 },
  labelBank: { marginTop: 10, padding: 15, backgroundColor: "#F1F5F9", borderRadius: 15 },
  bankTitle: { fontSize: 14, fontWeight: "700", color: "#475569", marginBottom: 10, textAlign: "center" },
  bankGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  labelBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1" },
  labelBtnActive: { backgroundColor: "#3B82F6", borderColor: "#2563EB" },
  labelBtnUsed: { backgroundColor: "#E2E8F0", opacity: 0.5 },
  labelText: { fontSize: 12, fontWeight: "600", color: "#334155" },
  labelTextActive: { color: "#fff" },
  labelTextUsed: { textDecorationLine: "line-through" },
  resultBox: { padding: 16, borderRadius: 15, borderWidth: 2, marginTop: 20 },
  resBlue: { backgroundColor: "#EFF6FF", borderColor: "#93C5FD" },
  resGreen: { backgroundColor: "#ECFDF5", borderColor: "#86EFAC" },
  resTitle: { fontWeight: "800", fontSize: 16, color: "#111827" },
  resScore: { fontSize: 24, fontWeight: "900", color: "#2563EB", marginTop: 4 },
  resMeta: { fontSize: 12, color: "#64748B" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  btnPrimary: { flex: 1, backgroundColor: "#2563EB", padding: 15, borderRadius: 12, alignItems: "center" },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
  btnDisabled: { backgroundColor: "#94A3B8" },
  btnSecondary: { flexDirection: "row", gap: 6, backgroundColor: "#E2E8F0", paddingHorizontal: 15, borderRadius: 12, alignItems: "center" },
  btnSecondaryText: { fontWeight: "700", color: "#334155" },
});