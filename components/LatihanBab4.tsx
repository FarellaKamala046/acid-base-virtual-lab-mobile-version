// src/components/LatihanBab4.tsx

import React, { useMemo, useState } from "react";
import { RefreshCcw, Check, X } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// --- Assets (sesuaikan path) ---
import imgBuret from "../assets/images/buret.png";
import imgErlenmeyer from "../assets/erlenmeyer.png";
import imgGelasKimia from "../assets/gelas-kimia.png";
import imgPipetTetes from "../assets/pipet-tetes.png";
import imgPipetVolume from "../assets/pipet-volume.png";
import imgStatif from "../assets/statif.png";

type Equipment = {
  id: string;
  name: string;
  imageSrc: string; // untuk bundler web (Vite/CRA) biasanya string URL hasil import
};

type Label = {
  id: string;
  name: string;
};

type DroppedLabelsMap = Record<string, string>; // { equipmentId: labelId }

type QuizResult = {
  score: number;
  correct: number;
  total: number;
} | null;

const EQUIPMENT_LIST: Equipment[] = [
  { id: "alat_buret", name: "Buret", imageSrc: imgBuret },
  { id: "alat_erlenmeyer", name: "Labu Erlenmeyer", imageSrc: imgErlenmeyer },
  { id: "alat_gelas_kimia", name: "Gelas Kimia", imageSrc: imgGelasKimia },
  { id: "alat_pipet_tetes", name: "Pipet Tetes", imageSrc: imgPipetTetes },
  { id: "alat_pipet_volume", name: "Pipet Volume", imageSrc: imgPipetVolume },
  { id: "alat_statif", name: "Statif", imageSrc: imgStatif },
];

const LABELS: Label[] = EQUIPMENT_LIST.map((item) => ({
  id: `label_${item.id}`,
  name: item.name,
}));

type EquipmentBoxProps = {
  equipment: Equipment;
  droppedLabelId?: string;
  correctLabelId: string;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetBoxId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  isSubmitted: boolean;
};

function EquipmentBox({
  equipment,
  droppedLabelId,
  correctLabelId,
  onDrop,
  onDragOver,
  isSubmitted,
}: EquipmentBoxProps) {
  const droppedLabel = LABELS.find((label) => label.id === droppedLabelId);

  const isCorrect: boolean | undefined = isSubmitted
    ? droppedLabelId === correctLabelId
    : undefined;

  const borderStyle =
    isCorrect === true
      ? "border-green-500 bg-green-50"
      : isCorrect === false
      ? "border-red-500 bg-red-50"
      : "border-blue-300 hover:border-blue-400";

  return (
    <div
      className={`flex flex-col w-full rounded-xl shadow-md overflow-hidden border-2 ${borderStyle} transition-colors duration-200`}
    >
      {/* Bagian Atas: Gambar Alat */}
      <div
        className={`h-36 bg-blue-50 flex items-center justify-center p-2 border-b-2 ${borderStyle} overflow-hidden`}
      >
        <img
          src={equipment.imageSrc}
          alt={equipment.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Bagian Bawah: Drop Zone Label */}
      <div
        id={equipment.id}
        onDrop={(e) => onDrop(e, equipment.id)}
        onDragOver={onDragOver}
        className="h-20 flex items-center justify-center p-2 text-center relative"
      >
        {droppedLabel ? (
          <span
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {droppedLabel.name}
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            Drop Label Nama Alat di Sini
          </span>
        )}

        {isSubmitted && (
          <div className="absolute top-1 right-1">
            {isCorrect ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type DraggableLabelProps = {
  label: Label;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, labelId: string) => void;
  isDropped: boolean;
};

function DraggableLabel({ label, onDragStart, isDropped }: DraggableLabelProps) {
  return (
    <div
      draggable={!isDropped}
      id={label.id}
      onDragStart={(e) => onDragStart(e, label.id)}
      className={`px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-lg shadow-sm cursor-grab text-sm font-medium text-blue-800 hover:shadow-md ${
        isDropped ? "opacity-30 cursor-not-allowed line-through" : ""
      }`}
    >
      {label.name}
    </div>
  );
}

export default function LatihanBab4TebakAlat(): React.ReactElement {
  const { currentUser, userScores, refreshUserScores } = useAuth() as any;

  const [droppedLabels, setDroppedLabels] = useState<DroppedLabelsMap>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult>(null);

  const shuffledEquipment = useMemo(
    () => [...EQUIPMENT_LIST].sort(() => Math.random() - 0.5),
    []
  );

  const shuffledLabels = useMemo(
    () => [...LABELS].sort(() => Math.random() - 0.5),
    []
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    labelId: string
  ) => {
    e.dataTransfer.setData("labelId", labelId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetBoxId: string) => {
    e.preventDefault();
    const labelId = e.dataTransfer.getData("labelId");
    if (!labelId) return;

    if (!isSubmitted) {
      // Hapus label dari box lama kalau sudah kepakai
      const updated: DroppedLabelsMap = { ...droppedLabels };
      Object.keys(updated).forEach((k) => {
        if (updated[k] === labelId) delete updated[k];
      });

      setDroppedLabels({ ...updated, [targetBoxId]: labelId });
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;

    shuffledEquipment.forEach((equipment) => {
      if (droppedLabels[equipment.id] === `label_${equipment.id}`) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / shuffledEquipment.length) * 100);

    if (currentUser) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        await setDoc(
          userRef,
          {
            Bab4Score: Math.max(finalScore, userScores?.Bab4Score || 0),
          },
          { merge: true }
        );
        await refreshUserScores?.();
      } catch (error) {
        console.error("Gagal menyimpan skor Bab 4:", error);
      }
    }

    setIsSubmitted(true);
    setQuizResult({
      score: finalScore,
      correct: correctCount,
      total: shuffledEquipment.length,
    });
  };

  const handleReset = () => {
    setDroppedLabels({});
    setIsSubmitted(false);
    setQuizResult(null);
  };

  const isLabelDropped = (labelId: string) =>
    Object.values(droppedLabels).includes(labelId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Latihan Mengenal Alat Laboratorium
      </h2>
      <p className="text-gray-600 text-sm">
        Geser nama alat dari bawah dan taruh di bagian bawah gambar alat yang sesuai.
      </p>

      {/* Area Kotak Alat */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {shuffledEquipment.map((equipment) => (
          <EquipmentBox
            key={equipment.id}
            equipment={equipment}
            droppedLabelId={droppedLabels[equipment.id]}
            correctLabelId={`label_${equipment.id}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            isSubmitted={isSubmitted}
          />
        ))}
      </div>

      {/* Area Label Draggable */}
      <div className="p-4 bg-gray-50 rounded-lg shadow-inner mt-6">
        <h3 className="font-medium text-gray-700 mb-3 text-center">
          Nama Alat (Drag dari sini):
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {shuffledLabels.map((label) => (
            <DraggableLabel
              key={label.id}
              label={label}
              onDragStart={handleDragStart}
              isDropped={isLabelDropped(label.id)}
            />
          ))}
        </div>
      </div>

      {/* Hasil + Tombol */}
      <div className="border-t mt-6 pt-4 space-y-4">
        {quizResult && (
          <div
            className={`p-4 rounded-xl ${
              quizResult.score === 100
                ? "bg-green-50 border-green-400"
                : "bg-blue-50 border-blue-400"
            } border-2`}
          >
            <p className="text-lg font-bold mb-1">Hasil Tebak Alat:</p>
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
            disabled={isSubmitted || Object.keys(droppedLabels).length !== shuffledEquipment.length}
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
