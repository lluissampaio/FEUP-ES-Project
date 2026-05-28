import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import ThemedText from "./ThemedText";

const LogoutButton = ({ onPress }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.searchBackground }]}
      activeOpacity={0.8}
    >
      <ThemedText style={[styles.text, { color: Colors.warning }]}>
        Log Out
      </ThemedText>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 18,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
