import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import { LinearGradient } from "expo-linear-gradient";
import { useWindowDimensions } from "react-native";

import userProfileImg from "../../assets/images/user-profile.jpg";
import materiImage from '../../assets/images/course.jpg';
import interaktifGif from '../../assets/images/interaktif.gif';
import labImage from '../../assets/images/lab.jpg';
import latihanGif from '../../assets/images/latihan.gif';
import pembelajaranGif from '../../assets/images/pembelajaran.webp';
import kuisImage from '../../assets/images/quiz.jpg';
import visualGif from '../../assets/images/visualisasi.gif';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react-native';

function FeatureCard({ imageSrc, title, description, onPress, style }: any) {
  return (
    <TouchableOpacity style={[styles.featureCard, style]} onPress={onPress}>
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
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();
  const { logout } = useAuth() as any;
  const { width } = useWindowDimensions();
  const isWide = width >= 768;


  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;
  const userPhoto = user?.photoURL || "https://via.placeholder.com/40";
  const handleProtectedNavigation = (targetRoute: string) => {
    if (isLoggedIn) {
      router.push(targetRoute as any);
    } else {
      router.push('/Login' as any);
    }
  };

  const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Gagal logout:", error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.customHeader}>
        <Text style={styles.brandText}>AcidBaseVLab</Text>
        
        {isLoggedIn ? (
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={() => Alert.alert("Profil", "Ini halaman profil Ken!")}>
              <Image source={userProfileImg} style={styles.profileImage} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutIconBtn} 
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ef4444" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.loginButtonSmall} 
            onPress={() => router.push('/Login' as any)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.headerShadow} />
      <ScrollView style={styles.container} contentContainerStyle={styles.pageWrapper} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#3B82F6", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} 
          style={styles.heroSection}
        >
          <Text style={styles.heroTitle}>Selamat Datang di Acid-Base Virtual Lab</Text>
          <Text style={styles.heroSubtitle}>Ayo belajar kimia dengan menyenangkan!</Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => handleProtectedNavigation("/Course")}
          >
            <Text style={styles.heroButtonText}>Mulai Sekarang</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Mulai Petualangan Belajarmu</Text>
          <View style={styles.sectionDivider} /> 
          <View style={styles.grid}>
            <FeatureCard
              imageSrc={materiImage}
              title="Materi Pembelajaran"
              description="Pelajari konsep dasar asam-basa, teori, indikator, dan perhitungan pH secara mendalam."
              onPress={() => handleProtectedNavigation('/Course')}
              style={{ width: isWide ? "48%" : "100%" }} 
            />
            <FeatureCard
              imageSrc={labImage}
              title="Virtual Lab"
              description="Lakukan eksperimen titrasi dan uji indikator di laboratorium virtual yang aman dan interaktif."
              onPress={() => handleProtectedNavigation('/VirtualLab')}
              style={{ width: isWide ? "48%" : "100%" }} 
            />
            <FeatureCard
              imageSrc={kuisImage}
              title="Kuis & Latihan"
              description="Uji pemahamanmu melalui berbagai kuis dan latihan soal interaktif yang menantang."
              onPress={() => handleProtectedNavigation('/Quiz')}
              style={{ width: isWide ? "48%" : "100%" }} 
            /> 
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Fitur Unggulan Kami</Text>
          <View style={styles.sectionDivider} /> 
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <KeyFeatureCard
              imageSrc={visualGif}
              title="Visualisasi Menarik"
              description="Lihat perubahan warna dan reaksi kimia melalui animasi yang jelas dan mudah dipahami."
            />
            <KeyFeatureCard
              imageSrc={interaktifGif}
              title="Interaktif"
              description="Kamu bisa mengontrol alat lab, menuang larutan, dan melihat hasil secara real-time."
            />
            <KeyFeatureCard
              imageSrc={pembelajaranGif}
              title="Video Pembelajaran"
              description="Video penjelasan singkat untuk membantumu memahami konsep-konsep yang sulit."
            />
            <KeyFeatureCard
              imageSrc={latihanGif}
              title="Latihan Menyenangkan"
              description="Kuis dalam bentuk gamifikasi yang membuat belajar tidak membosankan."
            />
          </ScrollView>
        </View>
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sectionDivider: {
    height: 3,
    backgroundColor: "#c9ccd1ff",
    marginBottom: 15,
    width: "100%",
    opacity: 0.4,
  },
  brandText: {
    fontSize: 23,
    fontWeight: '700',
    color: '#2563eb',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  loginButtonSmall: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerShadow: {
  height: 5,
  backgroundColor: 'rgba(0,0,0,0.15)',
  opacity: 0.15,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  logoutIconBtn: {
    padding: 8,
    backgroundColor: '#FEF2F2', 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  heroSection: {
    padding: 20,
    margin: 5,
    marginTop: 17,
    borderRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  heroSubtitle: { fontSize: 14, color: '#dbeafe', marginBottom: 15 },
  heroButton: { backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start' },
  heroButtonText: { color: '#2563eb', fontWeight: 'bold' },
  section: { padding: 15 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  pageWrapper: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1100,  
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  featureImage: { width: '100%', height: 160 },
  featureContent: { padding: 15 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
  featureDesc: { fontSize: 13, color: '#4b5563', marginTop: 5, textAlign: 'center' },
  horizontalScroll: { flexDirection: 'row' },
  keyCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, width: 220, marginRight: 15, elevation: 2, alignItems: 'center' },
  keyImage: { width: 120, height: 120, marginBottom: 10 },
  keyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  keyDesc: { fontSize: 12, color: '#4b5563', textAlign: 'center' }
});