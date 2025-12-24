import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { RefreshCcw, CheckCircle, XCircle } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";

// TODO: sesuaikan ini sama project kamu
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type SolutionType = "acid" | "base" | "neutral";
type LakmusColor = "merah" | "biru";
type Conclusion = "" | "Asam" | "Basa" | "Netral";

type Solution = {
  id: "glass1" | "glass2" | "glass3";
  name: string;
  type: SolutionType;
  drops: LakmusColor[];
};

type QuizResult =
  | null
  | {
      score: number;
      correct: number;
      total: number;
      isPerfect: boolean;
    }
  | { error: string };

const INITIAL_SOLUTIONS: Solution[] = [
  { id: "glass1", name: "Larutan A", type: "acid", drops: [] },
  { id: "glass2", name: "Larutan B", type: "base", drops: [] },
  { id: "glass3", name: "Larutan C", type: "neutral", drops: [] },
];

const getResultLabel = (originalColor: LakmusColor, solutionType: SolutionType) => {
  // aturan yang kamu pakai di web:
  // - Lakmus merah -> jadi biru kalau basa; tetap merah kalau asam/netral
  // - Lakmus biru -> jadi merah kalau asam; tetap biru kalau basa/netral
  if (originalColor === "merah") {
    return solutionType === "base" ? "M→B" : "M→M";
  }
  return solutionType === "acid" ? "B→M" : "B→B";
};

const getResultStyle = (originalColor: LakmusColor, solutionType: SolutionType) => {
  // warna label hasil (biar mirip web)
  if (originalColor === "merah") {
    return solutionType === "base" ? styles.dropBlue : styles.dropRed;
  }
  return solutionType === "acid" ? styles.dropRed : styles.dropBlue;
};

export default function LatihanBab1() {
  const { currentUser, userScores, refreshUserScores } = useAuth();

  const [solutions, setSolutions] = useState<Solution[]>(INITIAL_SOLUTIONS);
  const [selectedLakmus, setSelectedLakmus] = useState<LakmusColor | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [conclusions, setConclusions] = useState<Record<Solution["id"], Conclusion>>({
    glass1: "",
    glass2: "",
    glass3: "",
  });

  const [quizResult, setQuizResult] = useState<QuizResult>(null);

  const correctAnswers = useMemo<Record<Solution["id"], Exclude<Conclusion, "">>>(
    () => ({
      glass1: "Asam",
      glass2: "Basa",
      glass3: "Netral",
    }),
    []
  );

  const addDropToSolution = (targetId: Solution["id"]) => {
    if (!selectedLakmus) {
      Alert.alert("Pilih lakmus dulu", "Tap lakmus merah/biru dulu sebelum memilih gelas.");
      return;
    }

    setSolutions((prev) =>
      prev.map((sol) =>
        sol.id === targetId ? { ...sol, drops: [...sol.drops, selectedLakmus] } : sol
      )
    );
  };

  const handleConclusionChange = (id: Solution["id"], value: Conclusion) => {
    setConclusions((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const allAnswered = Object.values(conclusions).every((val) => val !== "");
    if (!allAnswered) {
      setQuizResult({ error: "Harap isi semua kesimpulan sebelum cek jawaban!" });
      return;
    }

    let correctCount = 0;
    (Object.keys(conclusions) as Solution["id"][]).forEach((id) => {
      if (conclusions[id] === correctAnswers[id]) correctCount++;
    });

    const finalScore = Math.round((correctCount / solutions.length) * 100);

    if (currentUser) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        const getScore = (scores: Record<string, unknown> | undefined, key: string): number => {
  const v = scores?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
};
        await setDoc(
          userRef,
          {
          Bab1Score: Math.max(finalScore, getScore(userScores, "Bab1Score")),
          },
          { merge: true }
        );

        await refreshUserScores?.();
      } catch (error) {
        console.error("Gagal menyimpan skor:", error);
      }
    }

    setIsSubmitted(true);
    setQuizResult({
      score: finalScore,
      correct: correctCount,
      total: solutions.length,
      isPerfect: correctCount === solutions.length,
    });
  };

  const handleReset = () => {
    setSolutions(INITIAL_SOLUTIONS);
    setConclusions({ glass1: "", glass2: "", glass3: "" });
    setIsSubmitted(false);
    setQuizResult(null);
    setSelectedLakmus(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h2}>Latihan Uji Indikator Lakmus</Text>
      <Text style={styles.p}>
        Tugasmu: pilih lakmus merah/biru, lalu tap Larutan A/B/C. Amati perubahannya, lalu tentukan sifat larutan
        (Asam/Basa/Netral).
      </Text>

      {/* Lakmus picker */}
      <View style={styles.lakmusWrap}>
        <Text style={styles.lakmusLabel}>Lakmus:</Text>

        <Pressable
          style={[
            styles.lakmusChip,
            styles.lakmusRed,
            selectedLakmus === "merah" && styles.lakmusSelected,
          ]}
          onPress={() => setSelectedLakmus("merah")}
        >
          <Text style={styles.lakmusChipText}>Merah</Text>
        </Pressable>

        <Pressable
          style={[
            styles.lakmusChip,
            styles.lakmusBlue,
            selectedLakmus === "biru" && styles.lakmusSelected,
          ]}
          onPress={() => setSelectedLakmus("biru")}
        >
          <Text style={styles.lakmusChipText}>Biru</Text>
        </Pressable>
      </View>

      {/* Beakers */}
      <View style={styles.grid}>
        {solutions.map((solution) => (
          <View key={solution.id} style={styles.cardWrap}>
            <Pressable
              onPress={() => addDropToSolution(solution.id)}
              style={[styles.beaker, isSubmitted && styles.beakerDisabled]}
              disabled={isSubmitted}
            >
              <Text style={styles.beakerTitle}>{solution.name}</Text>

              <View style={styles.dropList}>
                {solution.drops.map((drop, idx) => (
                  <View
                    key={`${solution.id}-${idx}`}
                    style={[styles.drop, getResultStyle(drop, solution.type)]}
                  >
                    <Text style={styles.dropText}>{getResultLabel(drop, solution.type)}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.beakerHint}>
                {isSubmitted ? "Terkunci" : "Tap di sini"}
              </Text>
            </Pressable>

            {/* Dropdown */}
            <View style={[styles.pickerWrap, isSubmitted && styles.pickerDisabled]}>
              <Picker
                enabled={!isSubmitted}
                selectedValue={conclusions[solution.id]}
                onValueChange={(v: Conclusion) => handleConclusionChange(solution.id, v)}
              >
                <Picker.Item label="-- Pilih Kesimpulan --" value="" />
                <Picker.Item label="Asam" value="Asam" />
                <Picker.Item label="Basa" value="Basa" />
                <Picker.Item label="Netral" value="Netral" />
              </Picker>
            </View>

            {/* Status */}
            {isSubmitted && (
              <View style={styles.statusRow}>
                {conclusions[solution.id] === correctAnswers[solution.id] ? (
                  <>
                    <CheckCircle size={16} color="#16A34A" />
                    <Text style={[styles.statusText, styles.correct]}>BENAR</Text>
                  </>
                ) : (
                  <>
                    <XCircle size={16} color="#DC2626" />
                    <Text style={[styles.statusText, styles.wrong]}>SALAH</Text>
                  </>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Result box */}
      <View style={styles.resultArea}>
        {"error" in (quizResult || {}) && quizResult && "error" in quizResult && (
          <View style={[styles.resultBox, styles.resultError]}>
            <Text style={styles.resultErrorText}>{quizResult.error}</Text>
          </View>
        )}

        {quizResult && "score" in quizResult && (
          <View style={[styles.resultBox, quizResult.isPerfect ? styles.resultPerfect : styles.resultNormal]}>
            <Text style={styles.resultTitle}>
              {quizResult.isPerfect ? "SELAMAT! SKOR SEMPURNA!" : "Hasil Latihanmu"}
            </Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultScore}>{quizResult.score} / 100</Text>
              <Text style={styles.resultMeta}>
                ({quizResult.correct} benar dari {quizResult.total})
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitted}
          style={[styles.btnPrimary, isSubmitted && styles.btnDisabled]}
        >
          <Text style={styles.btnPrimaryText}>{isSubmitted ? "Jawaban Terkunci" : "Cek Kesimpulan"}</Text>
        </Pressable>

        <Pressable onPress={handleReset} style={styles.btnSecondary}>
          <RefreshCcw size={16} color="#374151" />
          <Text style={styles.btnSecondaryText}>Ulangi Simulasi</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  p: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  lakmusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEFCE8",
  },
  lakmusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  lakmusChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  lakmusRed: { backgroundColor: "#DC2626" },
  lakmusBlue: { backgroundColor: "#2563EB" },
  lakmusSelected: {
    transform: [{ scale: 1.03 }],
    outlineColor: "transparent",
    borderWidth: 2,
    borderColor: "#111827",
  },
  lakmusChipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  grid: {
    gap: 14,
    marginTop: 6,
  },
  cardWrap: {
    gap: 10,
  },
  beaker: {
    borderWidth: 2,
    borderColor: "#34D399",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 14,
    minHeight: 140,
    justifyContent: "space-between",
  },
  beakerDisabled: { opacity: 0.7 },
  beakerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#374151",
  },
  beakerHint: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
  },
  dropList: {
    position: "absolute",
    top: 10,
    left: 10,
    gap: 6,
  },
  drop: {
    width: 56,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dropText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  dropRed: { backgroundColor: "#DC2626" },
  dropBlue: { backgroundColor: "#2563EB" },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  pickerDisabled: { backgroundColor: "#E5E7EB" },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  correct: { color: "#16A34A" },
  wrong: { color: "#DC2626" },

  resultArea: { marginTop: 8, gap: 10 },
  resultBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
  },
  resultNormal: { backgroundColor: "#EFF6FF", borderColor: "#60A5FA" },
  resultPerfect: { backgroundColor: "#ECFDF5", borderColor: "#34D399" },
  resultError: { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" },
  resultTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
    color: "#111827",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  resultScore: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1D4ED8",
  },
  resultMeta: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600",
  },
  resultErrorText: {
    color: "#991B1B",
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { backgroundColor: "#9CA3AF" },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  btnSecondary: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondaryText: {
    color: "#374151",
    fontWeight: "800",
    fontSize: 13,
  },
});
