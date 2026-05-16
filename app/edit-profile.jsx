import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Spacer from "@/components/Spacer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import AppIcon from "@/components/AppIcon";

export default function EditProfile() {
  const user = auth.currentUser;
  
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  
  const isAnonymous = !user;
  
  useEffect(() => {
    if (isAnonymous) {
      AsyncStorage.getItem("guestName").then((guestName) => {
        if (guestName) setName(guestName);
      });
    }
  }, [isAnonymous]);
  
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSave = async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      if (isAnonymous) {
        // Guest mode logic
        await AsyncStorage.setItem("guestName", name);
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
          { text: "OK", onPress: () => router.back() }
        ]);
        return;
      }

      const isEmailChanged = email !== user.email;
      const isPasswordChanged = newPassword.length > 0;
      const isNameChanged = name !== user.displayName;

      if (!isEmailChanged && !isPasswordChanged && !isNameChanged) {
        Alert.alert("Aviso", "Nenhuma alteração foi feita.");
        setLoading(false);
        return;
      }

      // If email or password is being changed, we need the current password to re-authenticate
      if (isEmailChanged || isPasswordChanged) {
        if (!currentPassword) {
          Alert.alert("Atenção", "É necessária a Palavra-passe atual para alterar o Email ou a Palavra-passe.");
          setLoading(false);
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
          await reauthenticateWithCredential(user, credential);
        } catch (error) {
          console.error("Erro na reautenticação:", error);
          Alert.alert("Erro", "Palavra-passe atual incorreta.");
          setLoading(false);
          return;
        }
      }

      // Proceed with updates
      if (isNameChanged) {
        await updateProfile(user, { displayName: name });
      }

      if (isEmailChanged) {
        await updateEmail(user, email);
      }

      if (isPasswordChanged) {
        if (newPassword.length < 6) {
          Alert.alert("Erro", "A nova Palavra-passe deve ter pelo menos 6 caracteres.");
          setLoading(false);
          return;
        }
        await updatePassword(user, newPassword);
      }

      await user.reload(); // Garante que a Firebase re-carrega os dados do user atualizados.

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => router.back() }
      ]);
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      let errorMessage = "Ocorreu um erro ao atualizar o perfil.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso por outra conta.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O email fornecido é inválido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A nova password é demasiado fraca.";
      }
      
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Spacer height={20} />
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <AppIcon name="back" size={24} color="#000" />
            </Pressable>
            <ThemedText title style={styles.logoText}>
              Editar Perfil
            </ThemedText>
            <View style={{ width: 24 }} />
          </View>

          <Spacer height={30} />

          {/* Nome */}
          <ThemedText style={styles.label}>Nome</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="O seu nome"
            placeholderTextColor="#999"
            editable={!loading}
          />

          <Spacer height={16} />

          {!isAnonymous && (
            <>
              {/* Email */}
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="O seu email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <Spacer height={16} />

              {/* Nova Password */}
              <ThemedText style={styles.label}>Nova Palavra-passe</ThemedText>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Deixe em branco para manter"
                  placeholderTextColor="#999"
                  secureTextEntry={!showNewPassword}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <AppIcon
                    name={showNewPassword ? "eye" : "eyeSlash"}
                    size={22}
                    color="#999"
                  />
                </Pressable>
              </View>

              <Spacer height={30} />

              {/* Current Password (for security) */}
              <ThemedText style={styles.label}>Palavra-passe Atual (Obrigatório para mudar Email/Pass)</ThemedText>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="A sua palavra-passe atual"
                  placeholderTextColor="#999"
                  secureTextEntry={!showCurrentPassword}
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  <AppIcon
                    name={showCurrentPassword ? "eye" : "eyeSlash"}
                    size={22}
                    color="#999"
                  />
                </Pressable>
              </View>

              <Spacer height={40} />
            </>
          )}

          {/* Botão Guardar */}
          <ThemedButton
            onPress={handleSave}
            style={styles.saveButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Guardar Alterações</ThemedText>
            )}
          </ThemedButton>
          
          <Spacer height={40} />
        </ScrollView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
  saveButton: {
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
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
