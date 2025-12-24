import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useAuth } from '../context/AuthContext'; // Aktifkan jika Auth sudah siap

// Import Assets (Pastikan path-nya benar di folder assets Ken yaaa)
import materiImage from '../../assets/images/course.jpg';
import interaktifGif from '../../assets/images/interaktif.gif';
import labImage from '../../assets/images/lab.jpg';
import latihanGif from '../../assets/images/latihan.gif';
import pembelajaranGif from '../../assets/images/pembelajaran.webp';
import kuisImage from '../../assets/images/quiz.jpg';
import visualGif from '../../assets/images/visualisasi.gif';

function FeatureCard({ imageSrc, title, description, onPress }: any) {
  return (
    <TouchableOpacity 
      style={styles.featureCard}
      onPress={onPress}
    >
      <Image source={imageSrc} style={styles.featureImage} resizeMode="cover" />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

function KeyFeatureCard({ imageSrc, title, description }: any) {
  return (
    <View style={styles.keyCard}>
      <Image source={imageSrc} style={styles.keyImage} resizeMode="contain" />
      <Text style={styles.keyTitle}>{title}</Text>
      <Text style={styles.keyDesc}>{description}</Text>
    </View>
  );
}

export default function HomePage() { 
  const router = useRouter();
  // const { currentUser } = useAuth(); // Pakai data asli nanti

  const handleStartClick = () => {
    // if (currentUser) {
      router.push('/Course'); 
    // } else {
    //   router.push('/login');
    // }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Selamat Datang di Acid-Base Virtual Lab</Text>
        <Text style={styles.heroSubtitle}>Ayo belajar kimia dengan menyenangkan!</Text>
        <TouchableOpacity style={styles.heroButton} onPress={handleStartClick}>
          <Text style={styles.heroButtonText}>Mulai Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Petualangan Belajar */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Mulai Petualangan Belajarmu</Text>
        <View style={styles.grid}>
          <FeatureCard
            imageSrc={materiImage}
            title="Materi Pembelajaran"
            description="Pelajari konsep dasar asam-basa, teori, indikator, dan perhitungan pH secara mendalam."
            onPress={() => router.push('/Course')}
          />
          <FeatureCard
            imageSrc={labImage}
            title="Virtual Lab"
            description="Lakukan eksperimen titrasi dan uji indikator di laboratorium virtual yang aman dan interaktif."
            // onPress={() => router.push('/VirtualLab')}
            onPress={() => router.push('/VirtualLab' as any)}
          />
          <FeatureCard
            imageSrc={kuisImage}
            title="Kuis & Latihan"
            description="Uji pemahamanmu melalui berbagai kuis dan latihan soal interaktif yang menantang."
            onPress={() => router.push('/Quiz')}
          /> 
        </View>
      </View>
      
      {/* Fitur Unggulan */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Fitur Unggulan Kami</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <KeyFeatureCard
            imageSrc={visualGif}
            title="Visualisasi Menarik"
            description="Belajar materi asam basa dengan tampilan website yang menarik."
          />
          <KeyFeatureCard
            imageSrc={interaktifGif}
            title="Interaktif"
            description="Belajar sambil praktik! Uji pemahamanmu dengan latihan yang interaktif."
          />
          <KeyFeatureCard
            imageSrc={pembelajaranGif}
            title="Video Pembelajaran"
            description="Video penjelasan singkat untuk membantumu memahami konsep."
          />
          <KeyFeatureCard
            imageSrc={latihanGif}
            title="Latihan Menyenangkan"
            description="Latihan dan kuis yang akan menguji pemahamanmu."
          />
        </ScrollView>
      </View>

      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  heroSection: {
    backgroundColor: '#3b82f6', // Biru gradient-ish
    padding: 30,
    margin: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  heroSubtitle: { fontSize: 16, color: '#dbeafe', marginBottom: 20 },
  heroButton: { backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, alignSelf: 'flex-start' },
  heroButtonText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
  
  section: { padding: 15 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  
  grid: { gap: 15 },
  featureCard: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden', elevation: 3, marginBottom: 15 },
  featureImage: { width: '100%', height: 180 },
  featureContent: { padding: 15, alignItems: 'center' },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  featureDesc: { fontSize: 14, color: '#4b5563', textAlign: 'center' },

  horizontalScroll: { flexDirection: 'row' },
  keyCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, width: 220, marginRight: 15, elevation: 2, alignItems: 'center' },
  keyImage: { width: 120, height: 120, marginBottom: 10 },
  keyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  keyDesc: { fontSize: 12, color: '#4b5563', textAlign: 'center' }
});