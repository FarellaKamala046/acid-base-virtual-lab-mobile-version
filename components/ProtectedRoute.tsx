import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!currentUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [currentUser, navigation]);

  if (!currentUser) {
    return null; // jangan render apa-apa sambil redirect
  }

  return <>{children}</>;
}
