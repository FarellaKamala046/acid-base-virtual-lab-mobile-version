import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../context/AuthContext'; 
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { HeaderBackButton } from '@react-navigation/elements';
import { View, Text, StyleSheet } from 'react-native';
// import * as WebBrowser from "expo-web-browser";

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();
// WebBrowser.maybeCompleteAuthSession();

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      <Stack.Screen 
        name="Login" 
        options={{ 
          headerTitle: 'Masuk Akun',
          headerShown: true,
          headerBackTitle: 'Back',   
          headerTintColor: '#007AFF', 
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