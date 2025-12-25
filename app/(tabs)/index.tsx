import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../../firebaseConfig'; // Pastikan path benar
import userProfileImg from "../../assets/images/user-profile.jpg";

// Import Assets
import materiImage from '../../assets/images/course.jpg';
import interaktifGif from '../../assets/images/interaktif.gif';
import labImage from '../../assets/images/lab.jpg';
import latihanGif from '../../assets/images/latihan.gif';
import pembelajaranGif from '../../assets/images/pembelajaran.webp';
import kuisImage from '../../assets/images/quiz.jpg';
import visualGif from '../../assets/images/visualisasi.gif';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react-native';

function FeatureCard({ imageSrc, title, description, onPress }: any) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <Image source={imageSrc} style={styles.featureImage} resizeMode="cover" />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Komponen Card buat yang bisa digeser (Horizontal)
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

  // Efek buat mantau login user secara real-time
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Kalau ada user, dia ngisi data. Kalau logout, jadi null.
    });
    return () => unsubscribe();
  }, []);

  // STATUS LOGIN (Ganti ke 'true' buat liat foto profil, 'false' buat tombol login)
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
    // Biasanya otomatis redirect ke Login karena AuthContext
  } catch (error) {
    console.error("Gagal logout:", error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* --- CUSTOM HEADER --- */}
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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Selamat Datang!</Text>
          <Text style={styles.heroSubtitle}>Ayo belajar kimia dengan menyenangkan!</Text>
          <TouchableOpacity 
            style={styles.heroButton} 
            onPress={() => handleProtectedNavigation('/Course')}
          >
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
              description="Pelajari konsep dasar asam-basa secara mendalam."
              onPress={() => handleProtectedNavigation('/Course')}
            />
            <FeatureCard
              imageSrc={labImage}
              title="Virtual Lab"
              description="Eksperimen titrasi di laboratorium virtual interaktif."
              onPress={() => handleProtectedNavigation('/VirtualLab')}
            />
            <FeatureCard
              imageSrc={kuisImage}
              title="Kuis & Latihan"
              description="Uji pemahamanmu melalui berbagai kuis menantang."
              onPress={() => handleProtectedNavigation('/Quiz')}
            /> 
          </View>
        </View>

        {/* --- FITUR UNGGULAN (YANG BISA DIGESER) --- */}
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
    borderBottomColor: '#f0f0f0',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3b82f6',
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
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10, // Jarak antara foto dan icon logout Ken
    },

    logoutIconBtn: {
      padding: 8,
      backgroundColor: '#FEF2F2', // Background merah muda transparan biar cakep
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  heroSection: {
    backgroundColor: '#3b82f6', 
    padding: 25,
    margin: 15,
    borderRadius: 20,
    elevation: 5,
  },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  heroSubtitle: { fontSize: 14, color: '#dbeafe', marginBottom: 15 },
  heroButton: { backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start' },
  heroButtonText: { color: '#2563eb', fontWeight: 'bold' },
  section: { padding: 15 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  grid: { gap: 15 },
  featureCard: { backgroundColor: 'white', borderRadius: 15, overflow: 'hidden', elevation: 3, marginBottom: 15 },
  featureImage: { width: '100%', height: 160 },
  featureContent: { padding: 15 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  featureDesc: { fontSize: 13, color: '#4b5563', marginTop: 5 },
  
  // Styles buat Horizontal Scroll
  horizontalScroll: { flexDirection: 'row' },
  keyCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, width: 220, marginRight: 15, elevation: 2, alignItems: 'center' },
  keyImage: { width: 120, height: 120, marginBottom: 10 },
  keyTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  keyDesc: { fontSize: 12, color: '#4b5563', textAlign: 'center' }
});