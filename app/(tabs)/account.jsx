import AccountHeader from "@/components/AccountHeader";
import AccountMenuItem from "@/components/AccountMenuItem";
import AccountThemeToggle from "@/components/AccountThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import ThemedView from "@/components/ThemedView";
import { auth } from "@/firebaseConfig";
import { useThemeStore } from "@/store/useThemeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const AccountScreen = () => {
  const { theme, setTheme } = useThemeStore();

  const [userData, setUserData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
    photoURL: auth.currentUser?.photoURL,
  });

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        auth.currentUser
          .reload()
          .then(() => {
            setUserData({
              name: auth.currentUser.displayName,
              email: auth.currentUser.email,
              photoURL: auth.currentUser.photoURL,
            });
          })
          .catch((error) => {
            if (
              error.code === "auth/user-token-expired" ||
              error.code === "auth/user-not-found"
            ) {
              Alert.alert(
                "Sessão Expirada",
                "O teu novo email foi confirmado com sucesso! Por questões de segurança, inicia sessão novamente com as tuas novas credenciais.",
                [
                  {
                    text: "Fazer Login",
                    onPress: async () => {
                      try {
                        await signOut(auth);
                        router.replace("/login");
                      } catch (err) {
                        router.replace("/");
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
            } else {
              console.warn("Outro erro de sessão detetado:", error.message);
            }
          });
      } else {
        AsyncStorage.getItem("guestName").then((guestName) => {
          setUserData({
            name: guestName || "Utilizador",
            email: "",
            photoURL: "",
          });
        });
      }
    }, []),
  );

  const menuItems = [
    {
      title: "Localização",
      icon: "location",
      onPress: () => router.push("/location"),
    },
    {
      title: "Ajuda",
      icon: "help",
      onPress: () => console.log("Ajuda pressed"),
    },
    {
      title: "Sobre nós",
      icon: "about",
      onPress: () => router.push("/about"),
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const userName =
    userData.name || userData.email?.split("@")[0] || "Utilizador";
  const userEmail = userData.email || "";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff`;

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AccountHeader
          name={userName}
          email={userEmail}
          avatarUrl={userData.photoURL || defaultAvatar}
          onEditPress={() => router.push("/edit-profile")}
        />

        <View style={styles.menuContainer}>
          <AccountThemeToggle currentTheme={theme} onSelectTheme={setTheme} />
          {menuItems.map((item, index) => (
            <AccountMenuItem
              key={index}
              title={item.title}
              iconName={item.icon}
              onPress={item.onPress}
            />
          ))}
        </View>

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </ThemedView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  menuContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E2E233",
  },
});
