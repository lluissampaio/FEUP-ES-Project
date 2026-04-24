import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';

import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Verificação email/password
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor preencha todos os campos');
      return;
    }
    
    // Aqui podemos adicionar a lógica de autenticação
    router.replace('/(tabs)');
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar password', 'Função ainda não implementada');
  };

  const handleRegister = () => {
    Alert.alert('Registo', 'Função ainda não implementada');
  };

  return (
    <ThemedView safe style={styles.container}>
      {/* Titulo */}
      <ThemedText title style={styles.logoText}>Log in</ThemedText>
      
      <Spacer height={30} />

      {/* Subtítulo */}
      <ThemedText style={styles.subtitle}>Insira as suas credenciais</ThemedText>

      <Spacer height={30} />

      {/* Email */}
      <ThemedText style={styles.label}>Email</ThemedText>
      <TextInput
        testID='email-input'
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
        testID='password-input'
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
        secureTextEntry
      />

      <Spacer height={12} />

      {/* Link recuperação da password */}
      <Pressable
        testID='forgot-password'
        onPress={handleForgotPassword}>
        <ThemedText style={styles.forgotPassword}>
          Esqueceu-se da sua password?
        </ThemedText>
      </Pressable>

      <Spacer height={30} />

      {/* Botão de Log In */}
      <ThemedButton 
        testID='login-button'
        onPress={handleLogin} style={styles.loginButton}>
        <ThemedText style={styles.buttonText}>Log In</ThemedText>
      </ThemedButton>

      <Spacer height={20} />

      {/* Link Registe-se */}
      <Pressable 
        testID='register'
        onPress={handleRegister}>
        <ThemedText style={styles.registerText}>
          Não tem uma conta? <ThemedText style={styles.registerLink}>Registe-se</ThemedText>
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
  forgotPassword: {
    textAlign: 'right',
    fontSize: 13,
    opacity: 0.7,
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});