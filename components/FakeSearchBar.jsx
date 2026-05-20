import { router } from "expo-router";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../constants/colors";
import AppIcon from "./AppIcon";
import ThemedText from "./ThemedText";

const FakeSearchBar = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Pressable
      testID="home-search-bar"
      style={[styles.searchBox, { backgroundColor: theme.searchBackground }]}
      onPress={() => router.push("/search/supermarkets")}
    >
      <AppIcon
        name="explore"
        size={18}
        color={Colors.searchPlaceholder}
        weight="bold"
      />
      <ThemedText
        style={[styles.placeholder, { color: Colors.searchPlaceholder }]}
      >
        Procurar Supermercado ...
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    minHeight: 56,
  },
  placeholder: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default FakeSearchBar;