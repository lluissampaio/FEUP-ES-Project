import { Colors } from "@/constants/colors";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import AppIcon from "./AppIcon";
import ThemedText from "./ThemedText";

const AccountThemeToggle = ({ currentTheme, onSelectTheme }) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.container}>
      <AppIcon
        name="sun"
        size={24}
        weight="regular"
        color={themeColors.iconColorFocused}
      />
      <ThemedText style={styles.title}>Tema</ThemedText>

      <View
        style={[
          styles.toggleGroup,
          { backgroundColor: themeColors.searchBackground },
        ]}
      >
        {["light", "dark", "system"].map((t) => {
          const iconMap = { light: "sun", dark: "moon", system: "gear" };
          const isActive = currentTheme === t;

          return (
            <TouchableOpacity
              key={t}
              onPress={() => onSelectTheme(t)}
              activeOpacity={0.7}
              style={[
                styles.toggleBtn,
                isActive && {
                  backgroundColor: themeColors.uiBackground,
                  shadowOpacity: 0.1,
                },
              ]}
            >
              <AppIcon
                name={iconMap[t]}
                size={18}
                color={isActive ? Colors.primary : themeColors.iconColor}
                weight={isActive ? "fill" : "regular"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AccountThemeToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E2E233",
  },
  title: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  toggleGroup: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    padding: 8,
    borderRadius: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0,
  },
});
