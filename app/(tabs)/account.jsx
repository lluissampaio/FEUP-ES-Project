import AccountHeader from "@/components/AccountHeader";
import AccountMenuItem from "@/components/AccountMenuItem";
import AccountThemeToggle from "@/components/AccountThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import ThemedView from "@/components/ThemedView";
import { useThemeStore } from "@/store/useThemeStore";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        auth.currentUser.reload().then(() => {
          setUserData({
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
          });
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
      onPress: () => console.log("Sobre nós pressed"),
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
  container: {
    flex: 1,
  },
  menuContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E2E233",
  },
});
