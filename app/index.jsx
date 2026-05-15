import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import Spacer from "@/components/Spacer";
import { Colors } from "@/constants/colors";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/home");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleGuest = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/welcome_bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View
          style={[
            styles.overlay,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 },
          ]}
        >
          <View style={styles.content}>
            {/* Logo */}
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Spacer height={30} />

            {/* Title */}
            <ThemedText style={styles.title}>Bem-vindo ao Cents</ThemedText>

            <Spacer height={15} />

            {/* Subtitle */}
            <ThemedText style={styles.subtitle}>
              O teu assistente inteligente para poupar{"\n"}em todas as compras de
              supermercado
            </ThemedText>
          </View>

          <View style={styles.footer}>
            {/* Registar Button */}
            <ThemedButton
              onPress={handleRegister}
              style={styles.registerButton}
              testID="welcome-register-button"
            >
              <ThemedText style={styles.buttonText}>Registar</ThemedText>
            </ThemedButton>

            {/* Login Button */}
            <ThemedButton
              onPress={handleLogin}
              style={styles.loginButton}
              testID="welcome-login-button"
            >
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            </ThemedButton>

            <Spacer height={20} />

            {/* Guest link */}
            <Pressable onPress={handleGuest} testID="continue-as-guest">
              <ThemedText style={styles.guestLink}>
                Continuar como convidado
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)", // Darker overlay for better contrast
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  registerButton: {
    width: "100%",
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    marginVertical: 0, // Reset default margin if any
  },
  loginButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    marginVertical: 0, // Reset default margin if any
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  guestLink: {
    color: "#FFFFFF",
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});

