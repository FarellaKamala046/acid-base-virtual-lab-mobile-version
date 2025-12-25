import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../context/AuthContext'; 
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { HeaderBackButton } from '@react-navigation/elements';
import { View, Text, StyleSheet } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  return (
    <Stack>
      {/* 1. Folder Utama (Tabs) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* 2. Halaman Login (Back Button Biru dengan Teks 'Back') ✨ */}
      <Stack.Screen 
        name="Login" 
        options={{ 
          headerTitle: 'Masuk Akun',
          headerShown: true,
          // headerBackVisible: true,     // Pastikan tombol back muncul
          headerBackTitle: 'Back',      // Memaksa teks jadi "Back", bukan "(tabs)"
          headerTintColor: '#007AFF',   // Warna biru khas iOS untuk tombol back
          // animation: 'slide_from_right',
          headerLeft: (props) => (
            <View style={{ marginLeft: -15, flexDirection: 'row', alignItems: 'center' }}> 
              <HeaderBackButton
                {...props}
                label="Back"
                onPress={() => router.replace('/(tabs)')} 
              />
            </View>
          ),
        }} 
      />

      {/* 3. Halaman Register ✨ */}
      <Stack.Screen 
        name="Register" 
        options={{ 
          headerTitle: 'Daftar Baru',
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: 'Back',
          headerTintColor: '#007AFF',
        }} 
      />

      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}