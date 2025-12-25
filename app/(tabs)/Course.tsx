import { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from "../../context/AuthContext";
import { Award, CheckCircle2 } from "lucide-react-native";

// Import Chapters
import Bab1 from '../course-chapters/Bab1';
import Bab2 from '../course-chapters/Bab2';
import Bab3 from '../course-chapters/Bab3';
import Bab4 from '../course-chapters/Bab4';

// Import Latihan (Pastikan path-nya benar ya Ken!)
import LatihanBab1 from '../../components/LatihanBab1';
import LatihanBab2 from '../../components/LatihanBab2';
import LatihanBab3 from '../../components/LatihanBab32';
import LatihanBab4 from '../../components/LatihanBab4';

export default function CourseScreen() {
  const { userScores } = useAuth() as any;
  // const [showExercise, setShowExercise] = useState(false);
  const router = useRouter()

// const onSelectTopic = (topic: any) => {
//   setSelectedTopic(topic);
//   setShowExercise(false); // tiap ganti bab, latihan disembunyiin dulu
// };


  // Pakai : any[] biar gak merah-merah lagi Ken!
  const courseModules: any[] = useMemo(() => {
    return [
      {
        id: 'm1_intro',
        title: 'Bab 1: Pengenalan Asam Basa',
        youtubeId: 'SawRQQ1kaME',
        content: Bab1, // Tulis nama komponennya aja, jangan pakai < /> dulu
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

  // Ini trik biar komponennya muncul dan gak kosong Ken!
  const ContentBody = selectedTopic.content;
  const ExerciseBody = selectedTopic.exercise;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.mainContainer}>
        {/* List Materi (Horizontal) */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Overview Materi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {courseModules.map((topic) => {
            // Anggap saja kita ambil skor berdasarkan ID bab
            // Misalnya: m1_intro -> Bab1, m2_teori -> Bab2
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
                {/* Judul Bab */}
                <Text style={[styles.moduleTitle, selectedTopic.id === topic.id && styles.activeText]}>
                  {topic.title}
                </Text>

                {/* CONTAINER SKOR & STATUS ✨ */}
                <View style={styles.scoreInfoRow}>
                  {/* Icon Nilai (Medal/Award) ✨ */}
                  <View style={styles.scoreItem}>
                    <Award size={16} color="#3b82f6" />
                    <Text style={styles.scoreValueText}>
                      Nilai: {score}/100
                    </Text>
                  </View>

                  {/* Icon Selesai ✨ */}
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
          {/* Video Player */}
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={230}
              play={false}
              videoId={selectedTopic.youtubeId}
            />
          </View>

          {/* Content Materi */}
          <View style={styles.textContent}>
            <Text style={styles.title}>{selectedTopic.title}</Text>
            {/* Panggil komponen di sini */}
            <ContentBody />

            {/* PEMISAH */}
            <View style={styles.sectionDivider} />

            {/* LATIHAN (LANGSUNG TAMPIL) */}
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

            {/* LATIHAN NYATU DI BAWAH MATERI
            <View style={styles.exerciseContainer}>
              <View style={styles.exerciseHeaderRow}>
                <Text style={styles.exerciseTitle}>Latihan Uji Indikator Lakmus</Text>

                <TouchableOpacity
                  style={[styles.btnToggle, showExercise && styles.btnToggleActive]}
                  onPress={() => setShowExercise((p) => !p)}
                >
                  <Text style={styles.btnToggleText}>
                    {showExercise ? "Sembunyikan" : "Mulai Latihan"}
                  </Text>
                </TouchableOpacity>
              </View>

              {showExercise && (
                <View style={styles.exerciseCard}>
                  <ExerciseBody />
                </View>
              )}
            </View> */}


          </View>

          {/* AREA LATIHAN (No Fill, Clean Look!) */}
          {/* <View style={styles.exerciseButtonSection}>
          <Text style={styles.hintText}>Sudah siap mencoba simulasi?</Text>
          <TouchableOpacity 
            style={styles.btnLaunch}
            // onPress={() => router.push('/LatihanBab1Screen' as any)}
          >
            <Text style={styles.btnText}>Ayo Latih Pengetahuanmu Sekarang!</Text>
          </TouchableOpacity>
        </View> */}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Sesuaikan warna background atas Ken
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Kuning pastel kamu
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
    borderRadius: 15, // Lebih round biar estetik
    marginRight: 10,
    width: 240,    // Dilebarin biar teks "Selesai" gak kepotong
    height: 65,       // Kasih tinggi tetap biar seragam
    justifyContent: 'center',
    elevation: 2,
  },
  activeCard: {
    // Pakai warna biru muda sesuai gambar referensi Ken
    backgroundColor: '#EBF5FF', 
    borderWidth: 1.5,
    borderColor: '#3B82F6', // Outline biru biar tegas
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
  // STYLE LATIHAN BARU (Tanpa Warna Biru)
  exerciseSection: {
    padding: 20,
    marginHorizontal: 15,
    backgroundColor: 'transparent', // Biar Gak Ada Warna (No Fill)
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
    backgroundColor: '#2563EB', // Biru cerah
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
    // padding: 1,
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
    // biar LatihanBab1 “fit” dan gak mepet card
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 2,
  },
  badgeContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start', // Biar kotak badgenya gak selebar kartu
  },
  badgeDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Hijau transparan tipis
  },
  badgePending: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)', // Abu-abu transparan tipis
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000ff',
  },
  scoreInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12, // Kasih jarak antar item
      marginTop: 8,
    },
    scoreItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4, // Jarak icon ke teks
    },
    scoreValueText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#757373ff', // Warna biru tua untuk angka nilai
    },
    statusDoneText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#329656ff', // Warna hijau untuk status selesai
    }
});