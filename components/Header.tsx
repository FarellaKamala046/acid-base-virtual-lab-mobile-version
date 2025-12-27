import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search, Bell, User } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

type UserLike = { email?: string | null };
type AuthLike = { currentUser?: UserLike | null };

export default function Header(): React.ReactElement {
  const { currentUser } = useAuth() as AuthLike;
  const navigation = useNavigation<any>();

  const firstChar = currentUser?.email?.charAt(0)?.toUpperCase();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.searchWrap}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search course, subject..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.brand}>VLab</Text>
      </View>

      <View style={styles.right}>
        {currentUser ? (
          <>
            <Bell size={22} color="#4B5563" />

            <View style={styles.userWrap}>
              <View style={styles.avatar}>
                {firstChar ? (
                  <Text style={styles.avatarText}>{firstChar}</Text>
                ) : (
                  <User size={18} color="#FFFFFF" />
                )}
              </View>

              <View style={styles.userTextWrap}>
                <Text style={styles.emailText}>{currentUser.email ?? ""}</Text>
                <Text style={styles.roleText}>Student</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.authButtons}>
            <Pressable
              onPress={() => navigation.navigate("Login")} 
              style={[styles.btn, styles.btnOutline]}
            >
              <Text style={[styles.btnText, styles.btnOutlineText]}>Login</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Register")}
              style={[styles.btn, styles.btnSolid]}
            >
              <Text style={[styles.btnText, styles.btnSolidText]}>Register</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  left: { flex: 1, gap: 8 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: "#111827" },
  brand: { fontSize: 18, fontWeight: "700", color: "#2563EB" },

  right: { flexDirection: "row", alignItems: "center", gap: 12 },
  userWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700" },
  userTextWrap: { display: "none" }, 
  emailText: { fontSize: 12, fontWeight: "600", color: "#111827" },
  roleText: { fontSize: 11, color: "#6B7280" },
  authButtons: { flexDirection: "row", gap: 10 },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnText: { fontSize: 13, fontWeight: "700" },
  btnOutline: { borderWidth: 1, borderColor: "#2563EB", backgroundColor: "#FFFFFF" },
  btnOutlineText: { color: "#2563EB" },
  btnSolid: { backgroundColor: "#2563EB" },
  btnSolidText: { color: "#FFFFFF" },
});
