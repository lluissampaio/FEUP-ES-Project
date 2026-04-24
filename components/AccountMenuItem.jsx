import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import AppIcon from "./AppIcon";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

const AccountMenuItem = ({ title, iconName, onPress }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.container}>
        <AppIcon name={iconName} size={24} weight="regular" color={theme.iconColorFocused} />
        <ThemedText style={styles.title}>{title}</ThemedText>
        <AppIcon name="chevronRight" size={18} color={theme.iconColorFocused} />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default AccountMenuItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E2E233", // Subtle divider
  },
  title: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "600",
  },
});
