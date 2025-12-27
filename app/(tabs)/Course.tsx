import { useMemo, useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from "../../context/AuthContext";
import { Award, CheckCircle2 } from "lucide-react-native";

import Bab1 from '../course-chapters/Bab1';
import Bab2 from '../course-chapters/Bab2';
import Bab3 from '../course-chapters/Bab3';
import Bab4 from '../course-chapters/Bab4';

import LatihanBab1 from '../../components/LatihanBab1';
import LatihanBab2 from '../../components/LatihanBab2';
import LatihanBab3 from '../../components/LatihanBab32';
import LatihanBab4 from '../../components/LatihanBab4';

export default function CourseScreen() {
  const { userScores } = useAuth() as any;
  const router = useRouter()

  const courseModules: any[] = useMemo(() => {
    return [
      {
        id: 'm1_intro',
        title: 'Bab 1: Pengenalan Asam Basa',
        youtubeId: 'SawRQQ1kaME',
        content: Bab1,
        exercise: LatihanBab1, 
      },
      {
        id: 'm2_teori',
        title: 'Bab 2: Teori Asam Basa',
        youtubeId: 'NQOeQC7a170',
        content: Bab2, 
        exercise: LatihanBab2, 
      },
      {
        id: 'm3_ph',
        title: 'Bab 3: Skala pH dan Perhitungan',
        youtubeId: 'DupXDD87oHc',
        content: Bab3, 
        exercise: LatihanBab3, 
      },
      {
        id: 'm4_reaksi',
        title: 'Bab 4: Reaksi Asam Basa',
        youtubeId: 'khJGRvx61_8',
        content: Bab4, 
        exercise: LatihanBab4, 
      },
    ];
  }, [userScores]);

  const [selectedTopic, setSelectedTopic] = useState(courseModules[0]);
  const ContentBody = selectedTopic.content;
  const ExerciseBody = selectedTopic.exercise;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.mainContainer}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Overview Materi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {courseModules.map((topic) => {
            const babKey = topic.id === 'm1_intro' ? 'Bab1' : 'Bab2';
            const score =
              topic.id === 'm1_intro' ? userScores?.Bab1Score :
              topic.id === 'm2_teori' ? userScores?.Bab2Score :
              topic.id === 'm3_ph' ? userScores?.Bab3Score :
              userScores?.Bab4Score;
            const isDone = score > 0;

            return (
              <TouchableOpacity 
                key={topic.id} 
                style={[styles.moduleCard, selectedTopic.id === topic.id && styles.activeCard]}
                onPress={() => setSelectedTopic(topic)}
              >
                <Text style={[styles.moduleTitle, selectedTopic.id === topic.id && styles.activeText]}>
                  {topic.title}
                </Text>

                <View style={styles.scoreInfoRow}>
                  <View style={styles.scoreItem}>
                    <Award size={16} color="#3b82f6" />
                    <Text style={styles.scoreValueText}>
                      Nilai: {score}/100
                    </Text>
                  </View>

                  {score > 0 && (
                    <View style={styles.scoreItem}>
                      <CheckCircle2 size={16} color="#22c55e" />
                      <Text style={styles.statusDoneText}>
                        Selesai
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          </ScrollView>
        </View>

        <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={230}
              play={false}
              videoId={selectedTopic.youtubeId}
            />
          </View>

          <View style={styles.textContent}>
            <Text style={styles.title}>{selectedTopic.title}</Text>
            <ContentBody />

            <View style={styles.sectionDivider} />

            <View style={styles.exerciseSectionCard}>
              <Text style={styles.exerciseSectionTitle}>
                {selectedTopic.id === 'm1_intro' && "Latihan Uji Indikator Lakmus"}
                {selectedTopic.id === 'm2_teori' && "Latihan Klasifikasi Teori"}
                {selectedTopic.id === 'm3_ph' && "Latihan Perhitungan pH"}
                {selectedTopic.id === 'm4_reaksi' && "Latihan Pengenalan Alat"}
              </Text>
              <Text style={styles.exerciseSectionDesc}>
                {selectedTopic.id === 'm1_intro' && "Geser kertas lakmus ke Larutan A, B, atau C. Amati perubahannya, lalu tentukan sifat larutan tersebut (Asam/Basa/Netral)"}
                {selectedTopic.id === 'm2_teori' && "Tap reaksi kimia lalu tap kotak teori yang sesuai untuk mengklasifikasikannya."}
                {selectedTopic.id === 'm3_ph' && "Ikuti langkah-langkah perhitungan untuk menentukan nilai pH larutan asam kuat."}
                {selectedTopic.id === 'm4_reaksi' && "Pilih nama alat laboratorium yang tepat untuk setiap gambar yang muncul."}
              </Text>

              <View style={styles.exerciseInner}>
                <ExerciseBody />
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  sidebar: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  moduleCard: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginRight: 10,
    width: 240,
    height: 65,
    justifyContent: 'center',
    elevation: 2,
  },
  activeCard: {
    backgroundColor: '#EBF5FF', 
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  activeText: {
    color: 'black',
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
  },
  videoWrapper: {
    width: '100%',
    backgroundColor: 'black',
  },
  textContent: {
    padding: 20,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 20,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  exerciseSection: {
    padding: 20,
    marginHorizontal: 15,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  exerciseHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exerciseButtonSection: {
  padding: 30,
  alignItems: 'center',
  },
  hintText: {
    marginBottom: 10,
    color: '#666',
    fontSize: 14,
  },
  btnLaunch: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    elevation: 5,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },

  exerciseHeaderRow: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  exerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    paddingRight: 10,
  },

  btnToggle: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#2563EB",
  },

  btnToggleActive: {
    backgroundColor: "#6B7280",
  },

  btnToggleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },

  exerciseCard: {
    marginTop: 12,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 15,
    marginTop: 0,
    marginBottom: 12,
  },

  exerciseSectionCard: {
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 2,
    marginBottom: 14,
  },

  exerciseSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },

  exerciseSectionDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 18,
  },

  exerciseInner: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 2,
  },
  badgeContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start', 
  },
  badgeDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
  },
  badgePending: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000ff',
  },
  scoreInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12, 
      marginTop: 8,
    },
    scoreItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    scoreValueText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#757373ff', 
    },
    statusDoneText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#329656ff', 
    }
});