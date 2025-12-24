// LatihanBab3Kalkulator.tsx
import { doc, setDoc } from "firebase/firestore";
import { Check, RefreshCcw, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";

type StepBase = {
  id: string;
  prompt: string;
};

type StepInput = StepBase & {
  kind: "input";
  answer: string;
  unit?: string; // ✅ bikin optional biar aman
  calculation: (molarity: number, valence: number) => number;
};

type StepChoice = StepBase & {
  kind: "choice";
  answer: string;
  options: string[];
};

type StepCalc = StepBase & {
  kind: "calc";
  answer: string;
  calculation: (hPlus: number) => number;
};

type Step = StepInput | StepChoice | StepCalc;

type Problem = {
  id: string;
  text: string;
  type: "strong_acid" | "strong_base" | "weak_acid" | "weak_base";
  molarity: number;
  valence: number;
  steps: Step[];
};

const PROBLEM: Problem = {
  id: "ph_hcl_001",
  text: "Hitung pH larutan HCl 0.01 M!",
  type: "strong_acid",
  molarity: 0.01,
  valence: 1,
  steps: [
    {
      id: "step1",
      kind: "input",
      prompt: "Tentukan konsentrasi [H⁺] (dalam M):",
      answer: "0.01",
      unit: "M",
      calculation: (m, v) => m * v,
    },
    {
      id: "step2",
      kind: "choice",
      prompt: "Masukkan rumus pH:",
      answer: "-log[H+]",
      options: ["-log[H+]", "14+log[OH-]", "-log[OH-]"],
    },
    {
      id: "step3",
      kind: "calc",
      prompt: "Hitung nilai pH:",
      answer: "2",
      calculation: (hPlus) => (hPlus ? -Math.log10(hPlus) : NaN),
    },
  ],
};

type StepStatus = "correct" | "incorrect";
type StepStatusMap = Record<string, StepStatus | undefined>;
type InputsMap = Record<string, string>;

export default function LatihanBab3Kalkulator(): React.ReactElement {
  const { currentUser, userScores, refreshUserScores } = useAuth();

  const [userInputs, setUserInputs] = useState<InputsMap>({});
  const [stepStatus, setStepStatus] = useState<StepStatusMap>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number } | null>(null);

  const correctAnswers = useMemo<Record<string, string>>(() => {
    const answers: Record<string, string> = {};

    const step1 = PROBLEM.steps.find((s) => s.id === "step1");
    const step2 = PROBLEM.steps.find((s) => s.id === "step2");
    const step3 = PROBLEM.steps.find((s) => s.id === "step3");

    if (!step1 || step1.kind !== "input") return answers;

    const hPlus = step1.calculation(PROBLEM.molarity, PROBLEM.valence);
    answers["step1"] = String(hPlus);

    if (step2 && step2.kind === "choice") {
      answers["step2"] = step2.answer;
    }

    if (step3 && step3.kind === "calc") {
      answers["step3"] = String(step3.calculation(hPlus));
    }

    return answers;
  }, []);

  const handleInputChange = (stepId: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [stepId]: value }));
    if (isSubmitted) {
      setStepStatus((prev) => ({ ...prev, [stepId]: undefined }));
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const newStepStatus: StepStatusMap = {};

    PROBLEM.steps.forEach((step) => {
      const userAnswer = (userInputs[step.id] ?? "").trim();
      const correct = (correctAnswers[step.id] ?? "").trim();
      const isCorrect = userAnswer === correct;

      newStepStatus[step.id] = isCorrect ? "correct" : "incorrect";
      if (isCorrect) correctCount++;
    });

    setStepStatus(newStepStatus);

    const finalScore = Math.round((correctCount / PROBLEM.steps.length) * 100);

    if (currentUser) {
      try {
        const userRef = doc(db, "user_scores", currentUser.uid);
        // helper aman untuk ambil angka dari userScores (karena tipe userScores = Record<string, unknown>)
const getScore = (key: string): number => {
  const v = (userScores as Record<string, unknown>)?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
};

await setDoc(
  userRef,
  { Bab3Score: Math.max(finalScore, getScore("Bab3Score")) },
  { merge: true }
);

        await refreshUserScores?.();
      } catch (error) {
        console.error("Gagal menyimpan skor Bab 3 (Kalkulator):", error);
      }
    }

    setIsSubmitted(true);
    setQuizResult({ score: finalScore });
  };

  const handleReset = () => {
    setUserInputs({});
    setStepStatus({});
    setIsSubmitted(false); // ✅ benerin bug: tadi setIsFinished
    setQuizResult(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Latihan Menghitung pH</h2>

      <div className="p-4 bg-yellow-50 rounded-lg shadow-inner text-center font-medium">
        {PROBLEM.text}
      </div>

      <div className="space-y-4">
        {PROBLEM.steps.map((step, index) => {
          const status = stepStatus[step.id];

          return (
            <div
              key={step.id}
              className={`p-4 border rounded-lg ${
                isSubmitted
                  ? status === "correct"
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <label htmlFor={step.id} className="block text-sm font-medium text-gray-700 mb-2">
                Langkah {index + 1}: {step.prompt}
              </label>

              {/* INPUT */}
              {step.kind !== "choice" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id={step.id}
                    value={userInputs[step.id] ?? ""}
                    onChange={(e) => handleInputChange(step.id, e.target.value)}
                    disabled={isSubmitted}
                    className={`flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                      isSubmitted
                        ? status === "correct"
                          ? "border-green-500 bg-green-100"
                          : "border-red-500 bg-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } ${isSubmitted ? "cursor-not-allowed" : ""}`}
                  />

                  {/* ✅ aman: unit cuma untuk StepInput */}
                  {step.kind === "input" && step.unit ? (
                    <span className="text-gray-500">{step.unit}</span>
                  ) : null}

                  {isSubmitted && status === "correct" && <Check className="w-5 h-5 text-green-600" />}
                  {isSubmitted && status === "incorrect" && <X className="w-5 h-5 text-red-600" />}
                </div>
              )}

              {/* CHOICE BUTTONS */}
              {step.kind === "choice" && (
                <div className="flex space-x-2">
                  {step.options.map((option) => {
                    const selected = userInputs[step.id] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange(step.id, option)}
                        disabled={isSubmitted}
                        className={`px-3 py-2 border rounded-md shadow-sm text-sm ${
                          selected
                            ? isSubmitted
                              ? status === "correct"
                                ? "bg-green-200 border-green-500 ring-2 ring-green-300"
                                : "bg-red-200 border-red-500 ring-2 ring-red-300"
                              : "bg-blue-100 border-blue-400 ring-2 ring-blue-200"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        } ${isSubmitted ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        <code>{option}</code>
                      </button>
                    );
                  })}

                  {isSubmitted && status === "correct" && (
                    <Check className="w-5 h-5 text-green-600 self-center" />
                  )}
                  {isSubmitted && status === "incorrect" && (
                    <X className="w-5 h-5 text-red-600 self-center" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t mt-6 pt-4 space-y-4">
        {quizResult && (
          <div
            className={`p-4 rounded-xl ${
              quizResult.score === 100 ? "bg-green-50 border-green-400" : "bg-blue-50 border-blue-400"
            } border-2`}
          >
            <p className="text-lg font-bold mb-1">Hasil Perhitungan pH:</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-blue-700">Skor: {quizResult.score} / 100</p>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            Cek Jawaban Keseluruhan
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
