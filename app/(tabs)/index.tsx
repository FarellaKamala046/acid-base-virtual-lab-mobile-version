import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Kartu Selamat Datang */}
      <View style={styles.card}>
        <Text style={styles.title}>Acid-Base VLab</Text>
        <Text style={styles.subtitle}>
          Belajar kimia jadi lebih simpel dan asikkk.
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => alert('Mulai Petualangan!')}
        >
          <Text style={styles.buttonText}>Mulai Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4', // Kuning pastel lembut
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    // Efek bayangan biar kelihatan modern (UI/UX Design)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FBC02D', // Kuning agak tua buat teks
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FBC02D',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});