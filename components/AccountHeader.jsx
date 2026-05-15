import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import AppIcon from "./AppIcon";
import { Colors } from "@/constants/colors";

const AccountHeader = ({ name, email, avatarUrl }) => {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: avatarUrl }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <TouchableOpacity>
            <AppIcon
              name="edit"
              size={18}
              color={Colors.primary}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.email}>{email}</ThemedText>
      </View>
    </ThemedView>
  );
};

export default AccountHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F2F3F2",
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  email: {
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 2,
  },
});
