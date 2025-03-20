import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OI PROFESSOR !</Text>
      <p>se puder dar um 10</p>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCBDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'green'
  }
});
