import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import LoginImage from "../assets/images/login-regis-gambar2.jpg";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * IMPORTANT:
   * - Kamu perlu isi clientId sesuai platform.
   * - Ambil dari Google Cloud / Firebase (OAuth client IDs).
   *
   * Minimal yang kepakai di Expo biasanya:
   * - expoClientId (untuk Expo Go)
   * - androidClientId (untuk Android build)
   * - iosClientId (untuk iOS build)
   * - webClientId (kalau kamu juga mau web tetap jalan)
   */
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "707065142121-vfncqba6iskg6tru2egkeg02jibob0on.apps.googleusercontent.com",
  });

  useEffect(() => {
    const signInFromGoogle = async () => {
      if (response?.type !== "success") return;

      try {
        const { authentication } = response;
        if (!authentication?.idToken) {
          Alert.alert("Google Sign-In gagal", "idToken tidak ditemukan. Pastikan OAuth Client ID kamu benar.");
          return;
        }

        const credential = GoogleAuthProvider.credential(authentication.idToken);
        await signInWithCredential(auth, credential);

        router.replace("/(tabs)");
      } catch (e: any) {
        console.error(e);
        Alert.alert("Google Sign-In error", e?.message ?? "Terjadi error saat login Google.");
      }
    };

    signInFromGoogle();
  }, [response, router]);

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error(err);
      setError("Email atau password salah. Coba lagi.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      // promptAsync akan buka browser / webview untuk login Google
      await promptAsync();
    } catch (e: any) {
      console.error(e);
      Alert.alert("Google Sign-In error", e?.message ?? "Tidak bisa membuka Google Sign-In.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={LoginImage} style={styles.illustration} resizeMode="contain" />

        <View style={styles.formSection}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Please enter your details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, !request && { opacity: 0.6 }]}
            onPress={handleGoogleLogin}
            disabled={!request}
          >
            <Image
              source={{ uri: "https://www.svgrepo.com/show/475656/google-color.svg" }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Log in with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/Register")}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 30,
  },
  illustration: {
    width: "100%",
    height: 150,
    marginBottom: 20,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#374151",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#6b7280",
  },
  linkText: {
    color: "#2563eb",
    fontWeight: "bold",
  },
});
