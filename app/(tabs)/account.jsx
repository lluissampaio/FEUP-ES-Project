import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ThemedView from "@/components/ThemedView";
import AccountHeader from "@/components/AccountHeader";
import AccountMenuItem from "@/components/AccountMenuItem";
import LogoutButton from "@/components/LogoutButton";

const AccountScreen = () => {
  const menuItems = [
    { title: "Localização", icon: "location" },
    { title: "Ajuda", icon: "help" },
    { title: "Sobre nós", icon: "about" },
  ];

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AccountHeader
          name="Luís Sampaio"
          email="luismbsampaio@gmail.com"
          avatarUrl=""
        />

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <AccountMenuItem
              key={index}
              title={item.title}
              iconName={item.icon}
              onPress={() => console.log(`${item.title} pressed`)}
            />
          ))}
        </View>

        <LogoutButton onPress={() => console.log("Logout pressed")} />
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
