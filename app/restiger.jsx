import { router } from 'expo-router';
import { StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';

import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Validação dos campos
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor preencha todos os campos');
      return;
    }

    // Verificar se a password está igual
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As passwords não coincidem');
      return;
    }

    // Password tamanho minimo 6 chars
    if (password.length < 6) {
      Alert.alert('Erro', 'A password deve ter pelo menos 6 caracteres');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor insira um email válido');
      return;
    }

    // TODO: Adicionar lógica de criação de conta no Firebase
    // Por enquanto, apenas mostra sucesso e redireciona
    Alert.alert(
      'Sucesso', 
      'Conta criada com sucesso!',
      [{ text: 'OK', onPress: () => router.replace('/') }]
    );
  };

  const handleLoginRedirect = () => {
    router.back(); // Volta para o ecrã de login
  };

  return (
    <ThemedView safe style={styles.container}>
      {/* Título */}
      <ThemedText title style={styles.logoText}>
        Criar Conta
      </ThemedText>

      <Spacer height={30} />

      {/* Subtítulo */}
      <ThemedText style={styles.subtitle}>
        Registe-se para começar
      </ThemedText>

      <Spacer height={30} />

      {/* Email */}
      <ThemedText style={styles.label}>Email</ThemedText>
      <TextInput
        testID="email-input"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Spacer height={16} />

      {/* Password */}
      <ThemedText style={styles.label}>Password</ThemedText>
      <TextInput
        testID="password-input"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
        secureTextEntry
      />

      <Spacer height={16} />

      {/* Confirmar Password */}
      <ThemedText style={styles.label}>Confirmar Password</ThemedText>
      <TextInput
        testID="confirm-password-input"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#999"
        secureTextEntry
      />

      <Spacer height={30} />

      {/* Botão de Registo */}
      <ThemedButton 
        testID="register-button"
        onPress={handleRegister} 
        style={styles.registerButton}
      >
        <ThemedText style={styles.buttonText}>Registar</ThemedText>
      </ThemedButton>

      <Spacer height={20} />

      {/* Link para voltar ao Login */}
      <Pressable 
        testID="login-redirect"
        onPress={handleLoginRedirect}
      >
        <ThemedText style={styles.loginText}>
          Já tem uma conta?{' '}
          <ThemedText style={styles.loginLink}>Faça login</ThemedText>
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  registerButton: {
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});