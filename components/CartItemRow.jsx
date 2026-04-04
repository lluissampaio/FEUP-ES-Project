import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";

const CartItemRow = ({ name, price }) => (
  <View style={styles.row} testID="cart-item">
    <ThemedText>{name}</ThemedText>
    <ThemedText>{price.toFixed(2)} €</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
});

export default CartItemRow;
