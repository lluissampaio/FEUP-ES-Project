import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

export default function Login() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title style={styles.title}>Login</ThemedText>
      <Spacer height={20} />
      <ThemedButton onPress={() => router.replace('/(tabs)')}>
        <ThemedText style={styles.buttonText}>Entrar</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
})