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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    const rootSegment = segments[0];
    const subSegment = segments[1];
    const inTabsGroup = rootSegment === '(tabs)';
    
    const isAtHome = !subSegment || (subSegment as string) === 'index';

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
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({color}) => <FontAwesome name="home" size={24} color={color} /> 
        }} 
      />

      <Tabs.Screen 
        name="Course" 
        options={{ 
          title: 'Materi', 
          tabBarIcon: ({color}) => <FontAwesome name="book" size={24} color={color} /> 
        }} 
      />

      <Tabs.Screen 
        name="VirtualLab" 
        options={{ 
          title: 'Lab', 
          tabBarIcon: ({color}) => <FontAwesome name="flask" size={24} color={color} /> 
        }} 
      />

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