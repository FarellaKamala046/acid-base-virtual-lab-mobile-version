import { useRouter } from "expo-router";
import {GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import LoginImage from "../assets/images/login-regis-gambar2.jpg";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const expoProxyRedirect = "https://auth.expo.io/@kenlynnwinata73/acid-base-vlab";
  const webRedirect = "http://localhost:8081";

  const redirectUri = Platform.OS === "web" ? webRedirect : expoProxyRedirect;
  console.log("PLATFORM:", Platform.OS);
  console.log("redirectUri:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "966017349107-95vo2mupbb5rksruqh8btm86lk8taah1.apps.googleusercontent.com",
    webClientId: "966017349107-95vo2mupbb5rksruqh8btm86lk8taah1.apps.googleusercontent.com",
    iosClientId: '966017349107-9v4f9ssooe7dql1u8scuvrfqcip4u6mm.apps.googleusercontent.com', 
    redirectUri,
    responseType: "id_token",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    const signInFromGoogle = async () => {
      console.log("AUTH RESPONSE:", response);

      if (response?.type !== "success") return;
      try {
        const { authentication } = response;
        const idToken =
          authentication?.idToken ||
          response?.params?.id_token;

        if (!idToken) {
          Alert.alert(
            "Google Sign-In gagal",
            "idToken tidak ditemukan. Login Google berhasil tapi token tidak diterima."
          );
          return;
        }
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);

        console.log("LOGIN GOOGLE BERHASIL");
        router.replace("/(tabs)");
      } catch (e: any) {
        console.error("GOOGLE LOGIN ERROR:", e);
        Alert.alert(
          "Google Sign-In error",
          e?.message ?? "Terjadi error saat login Google."
        );
      }
    };

    signInFromGoogle();
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password tidak boleh kosong!");
      return;
    }

    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-email') {
        setError("Format emailnya salah.");
      } else {
        setError("Email atau password salah. Coba lagi.");
      }
    }
  };


  const handleGoogleLogin = async () => {
    setError("");

    try {
      if (Platform.OS === "web") {
        const provider = new GoogleAuthProvider();
        provider.addScope("email");
        provider.addScope("profile");

        await signInWithPopup(auth, provider);
        router.replace("/(tabs)");
        return;
      }

      await promptAsync();

    } catch (e: any) {
      console.error(e);
      Alert.alert("Google Sign-In error", e?.message ?? "Tidak bisa login Google.");
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
            style={[
              styles.googleButton,
              Platform.OS !== "web" && !request && { opacity: 0.6 },
            ]}
            onPress={handleGoogleLogin}
            disabled={Platform.OS !== "web" && !request}
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
