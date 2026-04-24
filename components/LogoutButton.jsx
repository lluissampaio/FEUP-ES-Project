import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/colors";

const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.button}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.text}>Log Out</ThemedText>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F2F3F2",
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 18,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
});
