import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { RefreshCcw } from "lucide-react-native";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type TheoryId = "arrhenius" | "bronsted" | "lewis";

type Reaction = {
  id: string;
  eq: string;
  theories: TheoryId[];
};

type TheoryZone = {
  id: TheoryId;
  name: string;
};

type QuizResult = {
  score: number;
  correctAssociations: number; // raw score (bisa desimal karena penalti)
  maxAssociations: number;
};

const initialReactions: Reaction[] = [
  { id: "r1", eq: "HCl(aq) → H⁺(aq) + Cl⁻(aq)", theories: ["arrhenius", "bronsted", "lewis"] },
  { id: "r2", eq: "NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)", theories: ["bronsted", "lewis"] },
  { id: "r3", eq: "BF₃ + :NH₃ → F₃B←:NH₃", theories: ["lewis"] },
  { id: "r4", eq: "NaOH(aq) → Na⁺(aq) + OH⁻(aq)", theories: ["arrhenius", "lewis"] },
  { id: "r5", eq: "H₂O(l) + H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq)", theories: ["bronsted", "lewis"] },
];

const theoryZones: TheoryZone[] = [
  { id: "arrhenius", name: "Teori Arrhenius" },
  { id: "bronsted", name: "Teori Brønsted-Lowry" },
  { id: "lewis", name: "Teori Lewis" },
];

export default function LatihanBab2() {
  const { currentUser, userScores, refreshUserScores } = useAuth() as any;

  const [reactions] = useState<Reaction[]>(initialReactions);

  // Format: { r1: ['arrhenius','lewis'], r2: ['lewis'], ... }
  const [droppedInZones, setDroppedInZones] = useState<Record<string, TheoryId[]>>({});
  const [selectedReactionId, setSelectedReactionId] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const allPlaced = useMemo(() => {
    return reactions.every((r) => (droppedInZones[r.id]?.length ?? 0) > 0);
  }, [reactions, droppedInZones]);

  const toggleSelectReaction = (reactionId: string) => {
    if (isSubmitted) return;
    setSelectedReactionId((prev) => (prev === reactionId ? null : reactionId));
  };

  const dropSelectedToZone = (zoneId: TheoryId) => {
    if (isSubmitted) return;
    if (!selectedReactionId) return;

    setDroppedInZones((prev) => {
      const cur = prev[selectedReactionId] ?? [];
      if (cur.includes(zoneId)) return prev; // avoid duplicate
      return { ...prev, [selectedReactionId]: [...cur, zoneId] };
    });
  };

  const removeFromZone = (reactionId: string, zoneId: TheoryId) => {
    if (isSubmitted) return;
    setDroppedInZones((prev) => {
      const cur = prev[reactionId] ?? [];
      const next = cur.filter((z) => z !== zoneId);
      return { ...prev, [reactionId]: next };
    });
  };

  const getItemsInZone = (zoneId: TheoryId) => {
    return reactions.filter((r) => droppedInZones[r.id]?.includes(zoneId));
  };

  const handleSubmit = async () => {
    if (!allPlaced) return;

    let rawScore = 0;
    let maxScore = 0;

    reactions.forEach((reaction) => {
      const correctTheories = reaction.theories;
      const droppedTheories = droppedInZones[reaction.id] ?? [];

      maxScore += correctTheories.length;

      droppedTheories.forEach((theory) => {
        if (correctTheories.includes(theory)) rawScore += 1;
        else rawScore -= 0.5;
      });
    });

    rawScore = Math.max(0, rawScore);
    const finalScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

    if (currentUser?.uid) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        await setDoc(
          userRef,
          { Bab2Score: Math.max(finalScore, userScores?.Bab2Score ?? 0) },
          { merge: true }
        );
        if (typeof refreshUserScores === "function") {
          await refreshUserScores();
        }
      } catch (error) {
        console.error("Gagal menyimpan skor Bab 2:", error);
      }
    }

    setIsSubmitted(true);
    setSelectedReactionId(null);
    setQuizResult({
      score: finalScore,
      correctAssociations: rawScore,
      maxAssociations: maxScore,
    });
  };

  const handleReset = () => {
    setDroppedInZones({});
    setSelectedReactionId(null);
    setIsSubmitted(false);
    setQuizResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h2}>Latihan Klasifikasi Teori Asam Basa</Text>
      <Text style={styles.p}>
        Tugasmu: pilih reaksi → lalu tap kotak teori untuk menempatkannya. (Mobile-friendly version)
      </Text>

      {/* ZONES */}
      <View style={styles.zonesGrid}>
        {theoryZones.map((zone) => {
          const items = getItemsInZone(zone.id);

          const zoneStyle =
            zone.id === "arrhenius"
              ? styles.zoneRed
              : zone.id === "bronsted"
              ? styles.zoneBlue
              : styles.zoneGreen;

          return (
            <Pressable
              key={zone.id}
              onPress={() => dropSelectedToZone(zone.id)}
              style={[styles.zone, zoneStyle]}
            >
              <Text style={styles.zoneTitle}>{zone.name}</Text>

              {items.length === 0 ? (
                <Text style={styles.zoneHint}>
                  {selectedReactionId ? "Tap untuk drop ke sini" : "Pilih reaksi dulu"}
                </Text>
              ) : (
                <View style={styles.zoneList}>
                  {items.map((item) => (
                    <View key={`${zone.id}-${item.id}`} style={styles.zoneItem}>
                      <Text style={styles.code}>{item.eq}</Text>
                      {!isSubmitted && (
                        <Pressable
                          onPress={() => removeFromZone(item.id, zone.id)}
                          style={styles.removeBtn}
                        >
                          <Text style={styles.removeText}>hapus</Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* REACTIONS LIST */}
      <View style={styles.bank}>
        <Text style={styles.bankTitle}>Reaksi Kimia (tap untuk pilih):</Text>

        <View style={styles.bankGrid}>
          {reactions.map((r) => {
            const selected = selectedReactionId === r.id;
            return (
              <Pressable
                key={r.id}
                onPress={() => toggleSelectReaction(r.id)}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <Text style={styles.code}>{r.eq}</Text>
                {selected && <Text style={styles.selectedTag}>dipilih</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* RESULT */}
      <View style={styles.resultBlock}>
        {quizResult && (
          <View
            style={[
              styles.resultBox,
              quizResult.score === 100 ? styles.resultGreen : styles.resultBlue,
            ]}
          >
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
            disabled={isSubmitted || !allPlaced}
            style={[styles.primaryBtn, (isSubmitted || !allPlaced) && styles.btnDisabled]}
          >
            <Text style={styles.primaryBtnText}>
              {isSubmitted ? "Jawaban Terkunci" : "Cek Jawaban"}
            </Text>
          </Pressable>

          <Pressable onPress={handleReset} style={styles.secondaryBtn}>
            <RefreshCcw size={16} />
            <Text style={styles.secondaryBtnText}>Ulangi</Text>
          </Pressable>
        </View>

        {!allPlaced && !isSubmitted && (
          <Text style={styles.note}>Catatan: semua reaksi harus ditempatkan minimal ke 1 teori dulu.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  p: {
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 18,
  },

  zonesGrid: {
    gap: 12,
  },
  zone: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    minHeight: 140,
  },
  zoneRed: { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" },
  zoneBlue: { backgroundColor: "#EFF6FF", borderColor: "#93C5FD" },
  zoneGreen: { backgroundColor: "#ECFDF5", borderColor: "#86EFAC" },

  zoneTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },
  zoneHint: {
    textAlign: "center",
    color: "#6B7280",
    fontStyle: "italic",
    fontSize: 12,
  },
  zoneList: { gap: 8 },
  zoneItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },

  bank: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bankTitle: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
  },
  bankGrid: {
    gap: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  cardSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },

  code: {
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
  selectedTag: {
    marginTop: 6,
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "700",
  },

  removeBtn: {
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  removeText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },

  resultBlock: {
    marginTop: 4,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 14,
  },
  resultBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
  },
  resultGreen: { backgroundColor: "#ECFDF5", borderColor: "#86EFAC" },
  resultBlue: { backgroundColor: "#EFF6FF", borderColor: "#93C5FD" },
  resultTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8, color: "#111827" },
  resultRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  resultScore: { fontSize: 22, fontWeight: "900", color: "#1D4ED8" },
  resultMeta: { color: "#4B5563" },

  actions: { flexDirection: "row", gap: 10, alignItems: "center" },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#9CA3AF" },
  primaryBtnText: { color: "white", fontWeight: "800" },
  secondaryBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  secondaryBtnText: { fontWeight: "700", color: "#374151" },

  note: { color: "#6B7280", fontSize: 12 },
});
