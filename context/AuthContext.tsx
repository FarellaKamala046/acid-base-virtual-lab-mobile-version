import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

type UserScores = Record<string, unknown>;

type AuthContextValue = {
  currentUser: User | null;
  loading: boolean;
  userScores: UserScores;
  logout: () => Promise<void>;
  refreshUserScores: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userScores, setUserScores] = useState<UserScores>({});

  const fetchScores = async (user: User | null) => {
    if (!user) {
      setUserScores({});
      return;
    }
    try {
      const userRef = doc(db, "user_scores", user.uid);
      const snap = await getDoc(userRef);
      setUserScores(snap.exists() ? (snap.data() as UserScores) : {});
    } catch (err) {
      console.error("Error fetching scores:", err);
      setUserScores({});
    }
  };

  const refreshUserScores = async () => {
    await fetchScores(currentUser);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await fetchScores(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      loading,
      userScores,
      logout,
      refreshUserScores,
    }),
    [currentUser, loading, userScores]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
