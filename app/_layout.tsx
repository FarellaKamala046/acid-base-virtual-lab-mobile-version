import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { AuthProvider } from "../context/AuthContext";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { HeaderBackButton } from "@react-navigation/elements";
import { View, Text } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // ✅ pastikan file ini BENERAN ada di assets/fonts
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // ✅ pindahkan ke dalam effect + catch biar gak bikin crash startup
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {
      /* ignore */
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
  }, [loaded]);

  // ✅ jangan throw error di release build, tampilkan pesan
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Gagal load font. Cek assets/fonts/SpaceMono-Regular.ttf</Text>
      </View>
    );
  }

  // ✅ kasih fallback UI (jangan return null)
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
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
          headerTitle: "Masuk Akun",
          headerShown: true,
          headerBackTitle: "Back",
          headerTintColor: "#007AFF",
          headerLeft: (props) => (
            <View
              style={{
                marginLeft: -15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <HeaderBackButton
                {...props}
                label="Back"
                onPress={() => router.replace("/(tabs)")}
              />
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="Register"
        options={{
          headerTitle: "Daftar Baru",
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: "Back",
          headerTintColor: "#007AFF",
        }}
      />

      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
