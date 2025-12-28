import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Award, ChevronLeft, Timer } from "lucide-react-native";

import ImgBab1 from "../../assets/images/pengenalan.jpg";
import ImgBab2 from "../../assets/images/teori.jpg";
import ImgBab3 from "../../assets/images/ph.jpg";
import ImgBab4 from "../../assets/images/reaksi.jpg";

const QuestionBank = {
  1: [
    { id: "bab1q1", q: "Apa warna lakmus pada larutan asam kuat?", options: ["a. Merah", "b. Biru", "c. Hijau", "d. Tak Berwarna"], answerIndex: 0 },
    { id: "bab1q2", q: "Larutan asam memiliki pH...", options: ["a. < 7", "b. = 7", "c. > 7", "d. Selalu 14"], answerIndex: 0 },
    { id: "bab1q3", q: "Contoh basa kuat adalah...", options: ["a. NaOH", "b. HCl", "c. CH₄", "d. CO₂"], answerIndex: 0 },
  ],
  2: [
    { id: "bab2q1", q: "Teori asam menurut Arrhenius adalah zat yang menghasilkan ion...", options: ["a. OH⁻", "b. H⁺", "c. Na⁺", "d. Cl⁻"], answerIndex: 1 },
    { id: "bab2q2", q: "Teori Bronsted–Lowry: asam adalah...", options: ["a. Penerima pasangan elektron", "b. Pemberi pasangan elektron", "c. Pemberi proton (H⁺)", "d. Penerima proton (H⁺)"], answerIndex: 2 },
    { id: "bab2q3", q: "Dalam teori Lewis, asam adalah...", options: ["a. Penerima pasangan elektron", "b. Pemberi pasangan elektron", "c. Pemberi proton (H⁺)", "d. Penerima proton (H⁺)"], answerIndex: 0 },
  ],
  3: [
    { id: "bab3q1", q: "Larutan dengan pH = 3 bersifat...", options: ["a. Sangat Basa", "b. Basa", "c. Netral", "d. Asam"], answerIndex: 3 },
    { id: "bab3q2", q: "Jika pOH = 4 pada 25°C, maka pH = ...", options: ["a. 4", "b. 7", "c. 10", "d. 14"], answerIndex: 2 },
    { id: "bab3q3", q: "Larutan netral pada suhu kamar memiliki pH sekitar...", options: ["a. 0", "b. 7", "c. 10", "d. 14"], answerIndex: 1 },
  ],
  4: [
    { id: "bab4q1", q: "Reaksi netralisasi menghasilkan produk utama...", options: ["a. Garam dan air", "b. CO₂", "c. H₂", "d. NH₃"], answerIndex: 0 },
    { id: "bab4q2", q: "HCl(aq) + NaOH(aq) → ...", options: ["a. NaCl(aq) + H₂(g)", "b. NaCl(aq) + H₂O(l)", "c. NaCl(s) + H₂O(l)", "d. H₂O(l) saja"], answerIndex: 1 },
    { id: "bab4q3", q: "Netralisasi terjadi antara...", options: ["a. Asam dan garam", "b. Basa dan garam", "c. Asam dan basa", "d. Garam dan air"], answerIndex: 2 },
  ],
};

const ChapterImage: Record<number, any> = {
  1: ImgBab1,
  2: ImgBab2,
  3: ImgBab3,
  4: ImgBab4,
};

export default function QuizScreen() {
  const { currentUser, refreshUserScores } = useAuth() as any;
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = useMemo(() => {
    if (!activeChapter) return [];
    return (QuestionBank as any)[activeChapter] ?? [];
  }, [activeChapter]);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && timeLeft <= 0) {
      Alert.alert("Waktu Habis", "Waktu kuis Anda telah berakhir.");
      handleFinish();
    }
  }, [timeLeft, isRunning]);

  const handleFinish = async () => {
    let correct = 0;
    questions.forEach((q: any) => {
      if (answers[q.id] === q.answerIndex) correct += 1;
    });
    const score = Math.round((correct / questions.length) * 100);
    setFinalScore(score);
    setIsSubmitted(true);
    setIsRunning(false);
    clearInterval(timerRef.current);

    if (currentUser) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        const fieldName = `QuizBab${activeChapter}Score`;
        await setDoc(userRef, { [fieldName]: score }, { merge: true });
        await refreshUserScores?.();
      } catch (error) {
        console.error("Gagal simpan skor quiz:", error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (activeChapter === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <Text style={styles.headerTitle}>Daftar Quiz</Text>
          {[1, 2, 3, 4].map((id) => (
            <View key={id} style={styles.chapterCard}>
              <View style={styles.chapterLeft}>
                <Image source={ChapterImage[id]} style={styles.chapterImage} resizeMode="cover" />
                <View style={styles.chapterTextWrap}>
                  <Text style={styles.chapterTitle}>Bab {id}</Text>
                  <Text style={styles.chapterSubtitle}>3 Pertanyaan • 10 Menit</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  setActiveChapter(id);
                  setIsRunning(true);
                  setTimeLeft(600);
                  setAnswers({});
                  setIsSubmitted(false);
                }}
              >
                <Text style={styles.buttonText}>Start Quiz</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (!isSubmitted) {
              Alert.alert("Keluar Kuis?", "Progres kuis Anda akan hilang.", [
                { text: "Batal", style: "cancel" },
                { text: "Keluar", onPress: () => setActiveChapter(null) },
              ]);
            } else {
              setActiveChapter(null);
            }
          }}
        >
          <ChevronLeft color="#2563eb" size={24} />
          <Text style={styles.backText}>Keluar</Text>
        </TouchableOpacity>

        <View style={styles.timerRow}>
          <Timer size={18} color={timeLeft < 60 ? "#ef4444" : "#4b5563"} />
          <Text style={[styles.timerText, timeLeft < 60 && { color: "#ef4444" }]}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {questions.map((q: any, idx: number) => (
          <View
            key={q.id}
            style={[
              styles.qCard,
              isSubmitted && (answers[q.id] === q.answerIndex ? styles.correctCard : styles.wrongCard),
            ]}
          >
            <Text style={styles.qText}>
              {idx + 1}. {q.q}
            </Text>
            {q.options.map((opt: string, oi: number) => (
              <TouchableOpacity
                key={oi}
                disabled={isSubmitted}
                onPress={() => setAnswers({ ...answers, [q.id]: oi })}
                style={[
                  styles.optButton,
                  answers[q.id] === oi && styles.selectedOpt,
                  isSubmitted && q.answerIndex === oi && styles.correctOptBorder,
                ]}
              >
                <Text style={[styles.optText, answers[q.id] === oi && styles.selectedOptText]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {!isSubmitted ? (
          <TouchableOpacity
            style={[
              styles.finishButton,
              Object.keys(answers).length < questions.length && { backgroundColor: "#9ca3af" },
            ]}
            onPress={handleFinish}
            disabled={Object.keys(answers).length < questions.length}
          >
            <Text style={styles.buttonText}>Kirim Jawaban</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.scoreBoard}>
            <Award size={32} color="#1e40af" />
            <Text style={styles.scoreText}>Skor Akhir: {finalScore} / 100</Text>
            <TouchableOpacity style={styles.backMenuBtn} onPress={() => setActiveChapter(null)}>
              <Text style={styles.backMenuText}>Kembali ke Daftar Quiz</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: "800", marginBottom: 20, color: "#111827" },

  chapterCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chapterLeft: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 12 },
  chapterImage: { width: 90, height: 60, borderRadius: 10, marginRight: 14, backgroundColor: "#f3f4f6" },
  chapterTextWrap: { flexShrink: 1 },
  chapterTitle: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  chapterSubtitle: { fontSize: 12, color: "#6b7280", marginTop: 2 },

  startButton: { backgroundColor: "#2563eb", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "bold" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#2563eb", fontWeight: "bold", marginLeft: 4 },
  timerRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f3f4f6", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  timerText: { fontWeight: "700", marginLeft: 6, color: "#4b5563" },

  qCard: { backgroundColor: "white", padding: 18, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  correctCard: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  wrongCard: { backgroundColor: "#fef2f2", borderColor: "#fca5a5" },
  qText: { fontSize: 16, fontWeight: "700", marginBottom: 15, color: "#1f2937" },

  optButton: { padding: 14, borderRadius: 10, backgroundColor: "#f8fafc", marginBottom: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  optText: { color: "#475569", fontWeight: "500" },
  selectedOpt: { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
  selectedOptText: { color: "#1d4ed8", fontWeight: "700" },
  correctOptBorder: { borderColor: "#22c55e", borderWidth: 2 },

  finishButton: { backgroundColor: "#16a34a", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },

  scoreBoard: { backgroundColor: "#eff6ff", padding: 25, borderRadius: 20, alignItems: "center", marginTop: 10, borderWidth: 1, borderColor: "#bfdbfe" },
  scoreText: { fontSize: 22, fontWeight: "900", color: "#1e40af", marginVertical: 10 },
  backMenuBtn: { marginTop: 15, padding: 10 },
  backMenuText: { color: "#2563eb", fontWeight: "700", textDecorationLine: "underline" },
});
