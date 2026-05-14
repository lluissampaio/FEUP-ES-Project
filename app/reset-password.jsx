import { auth } from '@/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import AppIcon from '@/components/AppIcon';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor insira o seu email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Email enviado!',
        `Enviamos um link de recuperação para:\n\n${email}\n\nVerifique sua caixa de entrada e pasta de SPAM.`,
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'Erro ao enviar email de recuperação';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Não existe conta com este email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        {/* Título */}
        <ThemedText title style={styles.title}>
          Recuperar Senha
        </ThemedText>

        <Spacer height={40} />

        {/* Subtítulo */}
        <ThemedText style={styles.subtitle}>
          Enviaremos um link para seu email redefinir sua senha
        </ThemedText>

        <Spacer height={50} />

        {/* Email */}
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          testID="email-input"
        />

        <Spacer height={40} />

        {/* Botão Enviar */}
        <ThemedButton onPress={handleResetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>
              Enviar email de recuperação
            </ThemedText>
          )}
        </ThemedButton>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});