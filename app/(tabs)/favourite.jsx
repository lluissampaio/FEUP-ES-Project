import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Favourite</ThemedText>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})