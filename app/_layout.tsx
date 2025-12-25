import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../context/AuthContext'; // Sesuaikan path-nya ya Ken!
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';



export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
    // INI KUNCINYA! Bungkus semua dengan AuthProvider
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {

  return (
      <Stack>
        {/* 1. Folder Utama (Tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* 2. Halaman Login (Biar ada tombol Back tulisan 'Back') */}
        <Stack.Screen 
          name="Login" 
          options={{ 
            headerTitle: 'Masuk Akun',
            headerBackTitle: 'Back', // Ini kuncinya biar gak tulisan (tabs)
            headerShown: true 
          }} 
        />

        {/* 3. Halaman Register */}
        <Stack.Screen 
          name="Register" 
          options={{ 
            headerTitle: 'Daftar Baru',
            headerBackTitle: 'Back',
            headerShown: true 
          }} 
        />

        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
  );
}

