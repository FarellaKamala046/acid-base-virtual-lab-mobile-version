import React from "react";
import { View, StyleSheet } from "react-native";
import Navbar from "./Navbar";

type NavbarLayoutProps = {
  children: React.ReactNode;
};

export default function NavbarLayout({ children }: NavbarLayoutProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // gray-50
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
