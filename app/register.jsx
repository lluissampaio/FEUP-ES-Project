import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import Spacer from "@/components/Spacer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // MUDAR para async
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As passwords não coincidem");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A password deve ter pelo menos 6 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor insira um email válido");
      return;
    }

    setLoading(true); // NOVO - desativa botões
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // NOVO - cria conta no Firebase

      Alert.alert("Sucesso", "Conta criada!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (error) {
      // NOVO - trata erros do Firebase
      let errorMessage = "Erro ao criar conta";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email já registado";
          break;
        case "auth/weak-password":
          errorMessage = "Password muito fraca";
          break;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false); // NOVO - reativa botões
    }
  };

  const handleLoginRedirect = () => {
    router.back(); // Volta para o ecrã de login
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        {/* Título */}
        <ThemedText title style={styles.logoText}>
          Criar Conta
        </ThemedText>

        <Spacer height={30} />

        {/* Subtítulo */}
        <ThemedText style={styles.subtitle}>Registe-se para começar</ThemedText>

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
          editable={!loading}
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
          editable={!loading}
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
          editable={!loading}
        />

        <Spacer height={30} />

        {/* Botão de Registo */}
        <ThemedButton
          testID="register-button"
          onPress={handleRegister}
          style={styles.registerButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Registar</ThemedText>
          )}
        </ThemedButton>

        <Spacer height={20} />

        {/* Link para voltar ao Login */}
        <Pressable testID="login-redirect" onPress={handleLoginRedirect}>
          <ThemedText style={styles.loginText}>
            Já tem uma conta?{" "}
            <ThemedText style={styles.loginLink}>Faça login</ThemedText>
          </ThemedText>
        </Pressable>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  registerButton: {
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
  },
  loginLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
