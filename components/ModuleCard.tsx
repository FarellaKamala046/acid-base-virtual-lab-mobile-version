import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { CheckCircle, Award, Clock } from "lucide-react-native";

type Topic = {
  title: string;
  description: string;
  image: string; 
  score: number;
};

type ModuleCardProps = {
  topic: Topic;
  onPress: () => void;
  isActive: boolean;
};

export default function ModuleCard({
  topic,
  onPress,
  isActive,
}: ModuleCardProps) {
  const { title, description, image, score } = topic;
  const isModuleFinished = score > 0;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        isActive ? styles.cardActive : styles.cardInactive,
      ]}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.row}>
            <Award size={14} color="#3B82F6" />
            <Text style={styles.footerText}>
              Nilai: {score}/100
            </Text>
          </View>

          {isModuleFinished ? (
            <View style={styles.row}>
              <CheckCircle size={14} color="#16A34A" />
              <Text style={[styles.footerText, styles.success]}>
                Selesai
              </Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Clock size={14} color="#9CA3AF" />
              <Text style={[styles.footerText, styles.muted]}>
                Belum Selesai
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  cardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  cardInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },
  success: {
    color: "#16A34A",
  },
  muted: {
    color: "#9CA3AF",
  },
});