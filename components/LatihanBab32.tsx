import { doc, setDoc } from "firebase/firestore";
import { Check, RefreshCcw, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";

type Step = 
  | { id: string; kind: "input"; prompt: string; answer: string; unit?: string; calculation: (m: number, v: number) => number }
  | { id: string; kind: "choice"; prompt: string; answer: string; options: string[] }
  | { id: string; kind: "calc"; prompt: string; answer: string; calculation: (h: number) => number };

type Problem = {
  id: string;
  text: string;
  molarity: number;
  valence: number;
  steps: Step[];
};

const PROBLEM: Problem = {
  id: "ph_hcl_001",
  text: "Hitung pH larutan HCl 0.01 M!",
  molarity: 0.01,
  valence: 1,
  steps: [
    { id: "step1", kind: "input", prompt: "Tentukan konsentrasi [H⁺] (dalam M):", answer: "0.01", unit: "M", calculation: (m, v) => m * v },
    { id: "step2", kind: "choice", prompt: "Masukkan rumus pH:", answer: "-log[H+]", options: ["-log[H+]", "14+log[OH-]", "-log[OH-]"] },
    { id: "step3", kind: "calc", prompt: "Hitung nilai pH:", answer: "2", calculation: (h) => (h ? -Math.log10(h) : 0) },
  ],
};

export default function LatihanBab3() {
  const { currentUser, userScores, refreshUserScores } = useAuth() as any;
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [stepStatus, setStepStatus] = useState<Record<string, "correct" | "incorrect" | undefined>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const allAnswered = useMemo(() => {
    return PROBLEM.steps.every((step) => {
      const v = (userInputs[step.id] ?? "").trim();
      return v.length > 0;
    });
  }, [userInputs]);
  const [quizResult, setQuizResult] = useState<{ score: number } | null>(null);
  const correctAnswers = useMemo(() => {
  const hPlus = PROBLEM.molarity * PROBLEM.valence;
    return {
      step1: String(hPlus),
      step2: "-log[H+]",
      step3: String(-Math.log10(hPlus)),
    };
  }, []);

  const handleSubmit = async () => {
    let benar = 0;
    const newStatus: any = {};

    PROBLEM.steps.forEach((step) => {
      const input = (userInputs[step.id] ?? "").trim();
      const answer = (correctAnswers as any)[step.id];
      const isCorrect = input === answer;
      newStatus[step.id] = isCorrect ? "correct" : "incorrect";
      if (isCorrect) benar++;
    });

    const finalScore = Math.round((benar / PROBLEM.steps.length) * 100);
    setStepStatus(newStatus);

    if (currentUser?.uid) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        await setDoc(userRef, { 
          Bab3Score: finalScore 
        }, { merge: true });
        await refreshUserScores?.();
      } catch (e) { console.error("Firebase Error:", e); }
    }

    setIsSubmitted(true);
    setQuizResult({ score: finalScore });
  };

  const handleReset = () => {
    setUserInputs({});
    setStepStatus({});
    setIsSubmitted(false);
    setQuizResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>      
      <View style={styles.problemBox}>
        <Text style={styles.problemText}>{PROBLEM.text}</Text>
      </View>

      {PROBLEM.steps.map((step, index) => (
        <View key={step.id} style={[
          styles.stepCard, 
          isSubmitted && (stepStatus[step.id] === "correct" ? styles.cardCorrect : styles.cardIncorrect)
        ]}>
          <Text style={styles.label}>Langkah {index + 1}: {step.prompt}</Text>

          {step.kind !== "choice" ? (
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, isSubmitted && styles.inputDisabled]}
                value={userInputs[step.id] ?? ""}
                onChangeText={(val) => setUserInputs(p => ({...p, [step.id]: val}))}
                editable={!isSubmitted}
                placeholder="0.0..."
                keyboardType="numeric"
              />
              {step.kind === "input" && <Text style={styles.unitText}>{step.unit}</Text>}
              {isSubmitted && (stepStatus[step.id] === "correct" ? <Check color="green" size={20} /> : <X color="red" size={20} />)}
            </View>
          ) : (
            <View style={styles.choiceRow}>
              {step.options.map(opt => (
                <TouchableOpacity 
                  key={opt}
                  onPress={() => setUserInputs(p => ({...p, [step.id]: opt}))}
                  disabled={isSubmitted}
                  style={[
                    styles.choiceBtn,
                    userInputs[step.id] === opt && styles.choiceSelected,
                    isSubmitted && userInputs[step.id] === opt && (stepStatus[step.id] === "correct" ? styles.btnCorrect : styles.btnIncorrect)
                  ]}
                >
                  <Text style={styles.choiceText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      {quizResult && (
        <View style={[styles.resultBox, quizResult.score === 100 ? styles.resGreen : styles.resBlue]}>
          <Text style={styles.resTitle}>{quizResult.score === 100 ? "SELAMAT! SKOR SEMPURNA!" : "Hasil Latihanmu"}</Text>
          <Text style={styles.resScore}>{quizResult.score} / 100</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.btnMain, (!allAnswered || isSubmitted) && styles.btnDisabled]} 
          onPress={handleSubmit} 
          disabled={!allAnswered || isSubmitted}
        >
          <Text style={styles.btnMainText}>
            {isSubmitted ? "Jawaban Terkunci" : "Cek Jawaban"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
          <RefreshCcw size={18} color="#4b5563" />
          <Text style={styles.btnResetText}>Ulangi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 15, color: "#111827" },
  problemBox: { backgroundColor: "#FEFCE8", padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: "#FDE68A" },
  problemText: { textAlign: "center", fontWeight: "700", color: "#854d0e", fontSize: 16 },
  stepCard: { padding: 16, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 },
  cardCorrect: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  cardIncorrect: { backgroundColor: "#fef2f2", borderColor: "#fca5a5" },
  label: { fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 10 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, backgroundColor: "#fff", fontSize: 14 },
  inputDisabled: { backgroundColor: "#f3f4f6", color: "#9ca3af" },
  unitText: { fontWeight: "bold", color: "#6b7280" },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  choiceBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, backgroundColor: "#fff" },
  choiceSelected: { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
  choiceText: { fontSize: 13, fontWeight: "700" },
  btnCorrect: { backgroundColor: "#bbf7d0", borderColor: "#22c55e" },
  btnIncorrect: { backgroundColor: "#fecaca", borderColor: "#ef4444" },
  resultBox: { padding: 16, borderRadius: 15, borderWidth: 2, marginTop: 10 },
  resBlue: { backgroundColor: "#eff6ff", borderColor: "#93c5fd" },
  resGreen: { backgroundColor: "#ecfdf5", borderColor: "#86efac" },
  resTitle: { fontWeight: "800", fontSize: 16, color: "#111827" },
  resScore: { fontSize: 26, fontWeight: "900", color: "#2563eb", marginTop: 4 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  btnMain: { flex: 1, backgroundColor: "#2563eb", padding: 15, borderRadius: 12, alignItems: "center" },
  btnMainText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  btnDisabled: { backgroundColor: "#9ca3af", opacity: 0.7 },
  btnReset: { flexDirection: "row", gap: 6, backgroundColor: "#e5e7eb", paddingHorizontal: 15, borderRadius: 12, alignItems: "center" },
  btnResetText: { fontWeight: "700", color: "#4b5563" },
});1  