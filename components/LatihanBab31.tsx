// src/components/LatihanBab3Sortir.tsx

import React, { useCallback, useState } from "react";
import { RefreshCcw } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type ZoneId = "strong_acid" | "weak_acid" | "strong_base" | "weak_base";
type ItemId =
  | "item1"
  | "item2"
  | "item3"
  | "item4"
  | "item5"
  | "item6"
  | "item7"
  | "item8";

type Item = {
  id: ItemId;
  name: string;
  type: ZoneId;
};

type Zone = {
  id: ZoneId;
  name: string;
  color: string;
};

type DroppedMap = Partial<Record<ItemId, ZoneId>>;

type QuizResult = {
  score: number;
  correct: number;
  total: number;
} | null;

const ITEMS: Item[] = [
  { id: "item1", name: "HCl", type: "strong_acid" },
  { id: "item2", name: "NaOH", type: "strong_base" },
  { id: "item3", name: "CH₃COOH", type: "weak_acid" },
  { id: "item4", name: "NH₃", type: "weak_base" },
  { id: "item5", name: "H₂SO₄", type: "strong_acid" },
  { id: "item6", name: "KOH", type: "strong_base" },
  { id: "item7", name: "HCN", type: "weak_acid" },
  { id: "item8", name: "Mg(OH)₂", type: "weak_base" },
];

const ZONES: Zone[] = [
  { id: "strong_acid", name: "Asam Kuat", color: "bg-red-50 border-red-300" },
  { id: "weak_acid", name: "Asam Lemah", color: "bg-orange-50 border-orange-300" },
  { id: "strong_base", name: "Basa Kuat", color: "bg-blue-50 border-blue-300" },
  { id: "weak_base", name: "Basa Lemah", color: "bg-purple-50 border-purple-300" },
];

type SubstanceCardProps = {
  item: Item;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, itemId: ItemId) => void;
};

function SubstanceCard({ item, onDragStart }: SubstanceCardProps) {
  return (
    <div
      draggable
      id={item.id}
      onDragStart={(e) => onDragStart(e, item.id)}
      className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm cursor-grab text-center font-medium hover:shadow-md"
    >
      {item.name}
    </div>
  );
}

type CategoryDropZoneProps = {
  zone: Zone;
  droppedItems: Item[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, zoneId: ZoneId) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
};

function CategoryDropZone({
  zone,
  droppedItems,
  onDrop,
  onDragOver,
}: CategoryDropZoneProps) {
  return (
    <div
      id={zone.id}
      onDrop={(e) => onDrop(e, zone.id)}
      onDragOver={onDragOver}
      className={`p-4 rounded-xl border-2 min-h-[200px] ${zone.color} transition-shadow duration-200`}
    >
      <h3 className="font-semibold text-center mb-3">{zone.name}</h3>

      <div className="grid grid-cols-2 gap-2">
        {droppedItems.map((item) => (
          <div
            key={item.id}
            className="p-2 bg-white border border-gray-200 rounded text-center text-sm shadow-inner"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LatihanBab3Sortir(): React.ReactElement {
  const { currentUser, userScores } = useAuth();

  const [droppedItems, setDroppedItems] = useState<DroppedMap>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, itemId: ItemId) => {
      e.dataTransfer.setData("itemId", itemId);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, zoneId: ZoneId) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData("itemId") as ItemId;

      if (!isSubmitted) {
        setDroppedItems((prev) => ({ ...prev, [itemId]: zoneId }));
      }
    },
    [isSubmitted]
  );

  const handleSubmit = useCallback(async () => {
    let correctCount = 0;

    ITEMS.forEach((item) => {
      if (droppedItems[item.id] === item.type) correctCount++;
    });

    const finalScore = Math.round((correctCount / ITEMS.length) * 100);

    if (currentUser) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        const getScore = (
  scores: Record<string, unknown> | undefined,
  key: string
): number => {
  const v = scores?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
};
        await setDoc(
          userRef,
          {
          Bab3Score_Sortir: Math.max(finalScore, getScore(userScores, "Bab3Score_Sortir")),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Gagal menyimpan skor Bab 3 (Sortir):", error);
      }
    }

    setIsSubmitted(true);
    setQuizResult({ score: finalScore, correct: correctCount, total: ITEMS.length });
  }, [currentUser, droppedItems, userScores]);

  const handleReset = useCallback(() => {
    setDroppedItems({});
    setIsSubmitted(false);
    setQuizResult(null);
  }, []);

  const getItemsInZone = useCallback(
    (zoneId: ZoneId) => ITEMS.filter((item) => droppedItems[item.id] === zoneId),
    [droppedItems]
  );

  const allPlaced = Object.keys(droppedItems).length === ITEMS.length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Latihan 1: Sorting Asam/Basa Kuat &amp; Lemah
      </h2>

      <p className="text-gray-600 text-sm">
        <b>Drag</b> setiap zat kimia di bawah dan <b>Drop</b> ke kategori yang benar.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ZONES.map((zone) => (
          <CategoryDropZone
            key={zone.id}
            zone={zone}
            droppedItems={getItemsInZone(zone.id)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg shadow-inner mt-6">
        <h3 className="font-medium text-gray-700 mb-3 text-center">
          Zat Kimia (Drag dari sini):
        </h3>

        <div className="grid grid-cols-4 gap-3">
          {ITEMS.filter((item) => !droppedItems[item.id]).map((item) => (
            <SubstanceCard key={item.id} item={item} onDragStart={handleDragStart} />
          ))}

          {allPlaced && (
            <p className="col-span-full text-center text-gray-500 italic">
              Semua zat sudah ditempatkan.
            </p>
          )}
        </div>
      </div>

      <div className="border-t mt-6 pt-4 space-y-4">
        {quizResult && (
          <div
            className={`p-4 rounded-xl ${
              quizResult.score === 100 ? "bg-green-50 border-green-400" : "bg-blue-50 border-blue-400"
            } border-2`}
          >
            <p className="text-lg font-bold mb-1">Hasil Sorting:</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-blue-700">
                Skor: {quizResult.score} / 100
              </p>
              <p className="text-sm text-gray-600">
                ({quizResult.correct} / {quizResult.total} benar)
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitted || !allPlaced}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
          >
            Cek Jawaban
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors flex items-center gap-1 text-sm"
          >
            <RefreshCcw className="w-4 h-4" /> Ulangi
          </button>
        </div>
      </div>
    </div>
  );
}
