import AccountHeader from "@/components/AccountHeader";
import AccountMenuItem from "@/components/AccountMenuItem";
import AccountThemeToggle from "@/components/AccountThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import ThemedView from "@/components/ThemedView";
import { useThemeStore } from "@/store/useThemeStore";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const AccountScreen = () => {
  const { theme, setTheme } = useThemeStore();

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

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AccountHeader name="User123" email="user123@email.com" avatarUrl="" />

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
