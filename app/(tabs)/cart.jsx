import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function Cart() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Carrinho</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});