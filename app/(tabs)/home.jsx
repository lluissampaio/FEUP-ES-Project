import { Colors } from "@/constants/colors";
import { StyleSheet, View, useColorScheme } from "react-native";

import AppIcon from "@/components/AppIcon";
import FakeSearchBar from "@/components/FakeSearchBar";
import Spacer from "@/components/Spacer";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <AppIcon name="location" size={24} color={theme.text} weight="fill" />
        <ThemedText title style={styles.locationText}>
          Porto, Portugal
        </ThemedText>
      </View>

      <Spacer height={16} />

      <FakeSearchBar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
