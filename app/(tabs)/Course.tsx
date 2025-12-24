import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe"; // Perlu install: npx expo install react-native-youtube-iframe react-native-webview
// import { useAuth } from '../context/AuthContext'; // Aktifkan kalau AuthContext sudah siap

// Import Chapters (Pastikan sudah diconvert ke .tsx)
import Bab1 from './course-chapters/Bab1'; 
import Bab2 from './course-chapters/Bab2'; 
// import Bab3 from './course-chapters/Bab3'; 
// import Bab4 from './course-chapters/Bab4'; 

export default function CourseScreen() {
  // const { userScores } = useAuth(); // Pakai data asli nanti
  const userScores = { Bab1Score: 0, Bab2Score: 0 }; // Dummy data untuk tes

  const courseModules = useMemo(() => {
    return [
      {
        id: 'm1_intro',
        title: 'Bab 1: Pengenalan Asam Basa',
        description: 'Sifat-sifat dasar asam & basa, pengenalan indikator lakmus dan alami.',
        score: userScores.Bab1Score || 0,
        isFinished: userScores.Bab1Score > 0,
        youtubeId: 'SawRQQ1kaME',
        contentComponent: <Bab1 />,
      },
      {
        id: 'm2_teori',
        title: 'Bab 2: Teori Asam Basa',
        description: 'Mengenal tiga teori utama: Arrhenius, Brønsted-Lowry, dan Lewis.',
        score: userScores.Bab2Score || 0,
        isFinished: userScores.Bab2Score > 0,
        youtubeId: 'NQOeQC7a170',
        contentComponent: <Bab2 />,
      },
      // Bab 3 & 4 bisa ditambahin nanti ya Ken!
    ];
  }, [userScores]);

  const [selectedTopic, setSelectedTopic] = useState(courseModules[0]);

  return (
    <View style={styles.mainContainer}>
      {/* List Materi (Horizontal agar mobile-friendly) */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Overview Materi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {courseModules.map((topic) => (
            <TouchableOpacity 
              key={topic.id} 
              style={[styles.moduleCard, selectedTopic.id === topic.id && styles.activeCard]}
              onPress={() => setSelectedTopic(topic)}
            >
              <Text style={[styles.moduleTitle, selectedTopic.id === topic.id && styles.activeText]}>{topic.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contentArea}>
        {/* Video Player */}
        <View style={styles.videoWrapper}>
          <YoutubePlayer
            height={230}
            play={false}
            videoId={selectedTopic.youtubeId}
          />
        </View>

        {/* Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>{selectedTopic.title}</Text>
          {selectedTopic.contentComponent}
        </View>

        {/* Spacer Bawah */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF9C4', // Kuning pastel Ken
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
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginRight: 10,
    minWidth: 150,
  },
  activeCard: {
    backgroundColor: '#FBC02D',
  },
  moduleTitle: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    color: 'white',
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  }
});