import React, { useMemo } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogOut } from "lucide-react-native";

import { useAuth } from "../context/AuthContext";
// Kalau avatar kamu local image, pakai require.
// Kalau kamu udah punya path yang bener, boleh ganti ini.
const DefaultAvatar = require("../assets/user-profile.jpg");

type MenuItem = {
  name: string;
  route: string; // samain sama nama screen di navigator kamu
};

const menuItems: MenuItem[] = [
  { name: "Home Page", route: "Home" },
  { name: "Course", route: "Course" },
  { name: "Virtual Lab", route: "VirtualLab" },
  { name: "Quiz", route: "Quiz" },
];

export default function Navbar(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { currentUser, logout } = useAuth();

  const displayName = useMemo(() => {
    if (!currentUser) return "";
    return currentUser.displayName || currentUser.email || "User";
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      // arahkan ke Login / Home (pilih salah satu)
      navigation.navigate("Home");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  }

  return (
    <View style={styles.container}>
      {/* Brand */}
      <Pressable onPress={() => navigation.navigate("Home")} style={styles.brandWrap}>
        <Text style={styles.brand}>AcidBase VLab</Text>
      </Pressable>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>{item.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* Right side: user */}
      <View style={styles.right}>
        {currentUser ? (
          <View style={styles.userRow}>
            <Text style={styles.userText} numberOfLines={1}>
              {displayName}
            </Text>

            <Image source={DefaultAvatar} style={styles.avatar} />

            <Pressable onPress={handleLogout} style={styles.logoutBtn} hitSlop={10}>
              <LogOut size={18} color="#4B5563" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.authRow}>
            <Pressable onPress={() => navigation.navigate("Login")} style={styles.authBtnGhost}>
              <Text style={styles.authTextGhost}>Login</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Register")} style={styles.authBtnPrimary}>
              <Text style={styles.authTextPrimary}>Register</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandWrap: { paddingVertical: 6, paddingRight: 10 },
  brand: { fontSize: 18, fontWeight: "800", color: "#2563EB" },

  menu: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  menuText: { fontSize: 12, fontWeight: "600", color: "#374151" },

  right: { minWidth: 120, alignItems: "flex-end" },

  userRow: { flexDirection: "row", alignItems: "center", gap: 10, maxWidth: 180 },
  userText: { fontSize: 12, fontWeight: "600", color: "#374151", maxWidth: 90 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  logoutBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },

  authRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  authBtnGhost: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  authTextGhost: { fontSize: 12, fontWeight: "700", color: "#2563EB" },
  authBtnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },
  authTextPrimary: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
});
