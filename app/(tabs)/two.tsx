import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text style={styles.subtitle}>Halaman ini sudah tidak pakai template Expo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, opacity: 0.7, textAlign: "center" },
});
