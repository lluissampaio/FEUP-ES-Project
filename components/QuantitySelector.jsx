import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { Minus, Plus } from "phosphor-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function QuantitySelector({
  value = 1,
  onDecrement,
  onIncrement,
  min = 1,
  max = 99,
}) {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.searchBackground }]}
    >
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value <= min}
        style={[styles.button, value <= min && styles.disabled]}
        accessibilityLabel="Diminuir quantidade"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <Minus size={16} color={Colors.primary} weight="bold" />
      </TouchableOpacity>

      <ThemedText style={styles.value}>{value}</ThemedText>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={value >= max}
        style={[styles.button, value >= max && styles.disabled]}
        accessibilityLabel="Aumentar quantidade"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <Plus size={16} color={Colors.primary} weight="bold" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 4,
    alignSelf: "flex-start",
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.3,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 32,
    textAlign: "center",
  },
});
