import ThemedView from "@/components/ThemedView";
import { Pressable, StyleSheet } from "react-native";

const BaseCard = ({ children, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.pressed,
        style,
      ]}
    >
      <ThemedView style={styles.card}>{children}</ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.1)",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default BaseCard;
