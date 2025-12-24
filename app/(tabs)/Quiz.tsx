import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
// import { useAuth } from "../context/AuthContext"; // Aktifkan jika AuthContext sudah siap

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
  // Bab 3 & 4 datanya sama persis ya Ken, tinggal dicopy aja isinya ke sini
};

export default function QuizScreen() {
  // const { currentUser, userScores, refreshUserScores } = useAuth(); // Pakai data asli nanti
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any>({});
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
    if (isRunning && timeLeft <= 0) handleFinish();
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
    // await saveQuizScore(activeChapter, score); // Aktifkan fungsi firebase nanti
  };

  if (activeChapter === null) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Daftar Quiz</Text>
        {[1, 2].map((id) => (
          <View key={id} style={styles.chapterCard}>
            <Text style={styles.chapterTitle}>Bab {id}</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => {setActiveChapter(id); setIsRunning(true); setTimeLeft(600);}}>
              <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setActiveChapter(null)}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>Sisa waktu: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</Text>
      </View>

      {questions.map((q: any, idx: number) => (
        <View key={q.id} style={[styles.qCard, isSubmitted && (answers[q.id] === q.answerIndex ? styles.correctCard : styles.wrongCard)]}>
          <Text style={styles.qText}>{idx + 1}. {q.q}</Text>
          {q.options.map((opt: string, oi: number) => (
            <TouchableOpacity 
              key={oi} 
              disabled={isSubmitted}
              onPress={() => setAnswers({...answers, [q.id]: oi})}
              style={[styles.optButton, answers[q.id] === oi && styles.selectedOpt]}
            >
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {!isSubmitted && (
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.buttonText}>Selesai</Text>
        </TouchableOpacity>
      )}

      {isSubmitted && (
        <View style={styles.scoreBoard}>
          <Text style={styles.scoreText}>Skor: {finalScore} / 100</Text>
        </View>
      )}
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  chapterCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  chapterTitle: { fontSize: 18, fontWeight: '600' },
  startButton: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  backLink: { color: '#2563eb', fontWeight: 'bold' },
  timerText: { fontWeight: '600' },
  qCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  correctCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  wrongCard: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  qText: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  optButton: { padding: 12, borderRadius: 8, backgroundColor: '#f3f4f6', marginBottom: 8, borderWidth: 1, borderColor: '#d1d5db' },
  selectedOpt: { backgroundColor: '#dbeafe', borderColor: '#2563eb' },
  finishButton: { backgroundColor: '#16a34a', padding: 15, borderRadius: 10, alignItems: 'center' },
  scoreBoard: { backgroundColor: '#dbeafe', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  scoreText: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' }
});