import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import Spacer from "@/components/Spacer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import AppIcon from "@/components/AppIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Verificação email/password
    if (!email || !password) {
      Alert.alert("Erro", "Por favor preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro login:", error);
      Alert.alert("Erro", "Email ou password incorretos");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("reset-password");
  };

  const handleRegister = () => {
    router.push("/register"); // Vai para o ecrã de registo (register.jsx)
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        {/* Titulo */}
        <ThemedText title style={styles.logoText}>
          Log in
        </ThemedText>

        <Spacer height={30} />

        {/* Subtítulo */}
        <ThemedText style={styles.subtitle}>
          Insira as suas credenciais
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
          editable={!loading}
        />

        <Spacer height={16} />

        {/* Password */}
        <ThemedText style={styles.label}>Password</ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="password-input"
            style={[styles.input, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <AppIcon
              name={showPassword ? "eye" : "eyeSlash"}
              size={22}
              color="#999"
            />
          </Pressable>
        </View>

        <Spacer height={12} />

        {/* Link recuperação da password */}
        <Pressable testID="forgot-password" onPress={handleForgotPassword}>
          <ThemedText style={styles.forgotPassword}>
            Esqueceu-se da sua password?
          </ThemedText>
        </Pressable>

        <Spacer height={30} />

        {/* Botão de Log In */}
        <ThemedButton
          testID="login-button"
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Log In</ThemedText>
          )}
        </ThemedButton>

        <Spacer height={20} />

        {/* Link Registe-se */}
        <Pressable testID="register" onPress={handleRegister}>
          <ThemedText style={styles.registerText}>
            Não tem uma conta?{" "}
            <ThemedText style={styles.registerLink}>Registe-se</ThemedText>
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
  forgotPassword: {
    textAlign: "right",
    fontSize: 13,
    opacity: 0.7,
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    textAlign: "center",
    fontSize: 14,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
});
