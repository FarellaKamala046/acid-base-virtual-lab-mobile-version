import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../firebaseConfig';


export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. Pantau status login dari Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    const rootSegment = segments[0];
    const subSegment = segments[1];
    const inTabsGroup = rootSegment === '(tabs)';
    
    // Pakai 'as string' biar TypeScript nggak protes lagi
    const isAtHome = !subSegment || (subSegment as string) === 'index';

    // 2. Logic Satpam: Tendang ke Login kalau akses fitur tapi belum login
    if (!isLoggedIn && inTabsGroup && !isAtHome) {
      router.replace('/Login' as any);
    }

    return () => unsubscribe();
  }, [isLoggedIn, segments]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          height: 65,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#ffffff',
          position: 'absolute',
          elevation: 10,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. HOME - Menggunakan file index.tsx */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({color}) => <FontAwesome name="home" size={24} color={color} /> 
        }} 
      />

      {/* 2. COURSE / MATERI */}
      <Tabs.Screen 
        name="Course" 
        options={{ 
          title: 'Materi', 
          tabBarIcon: ({color}) => <FontAwesome name="book" size={24} color={color} /> 
        }} 
      />

      {/* 3. VIRTUAL LAB */}
      <Tabs.Screen 
        name="VirtualLab" 
        options={{ 
          title: 'Lab', 
          tabBarIcon: ({color}) => <FontAwesome name="flask" size={24} color={color} /> 
        }} 
      />

      {/* 4. QUIZ */}
      <Tabs.Screen 
        name="Quiz" 
        options={{ 
          title: 'Quiz', 
          tabBarIcon: ({color}) => <FontAwesome name="pencil" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}