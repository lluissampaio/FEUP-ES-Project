import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/colors";
import { X, Minus, Plus } from "phosphor-react-native";

const CartItemRow = ({
  name,
  price,
  quantity,
  subtitle,
  onRemove,
  onIncrement,
  onDecrement,
  image,
}) => (
  <View style={styles.card} testID="cart-item">
    <View style={styles.imageContainer}>
      <Image
        source={
          image || {
            uri: "https://cdn-icons-png.flaticon.com/512/3721/3721818.png",
          }
        }
        style={styles.image}
      />
    </View>

    <View style={styles.mainContent}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </View>
        <TouchableOpacity
          onPress={onRemove}
          style={styles.closeButton}
          testID="remove-item"
        >
          <X size={20} color="#b1b1b1" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={onDecrement} style={styles.qtyButton}>
            <Minus size={16} color={Colors.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.qtyText}>{quantity}</ThemedText>
          <TouchableOpacity onPress={onIncrement} style={styles.qtyButton}>
            <Plus size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.price}>
          {(price * quantity).toFixed(2)} €
        </ThemedText>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  mainContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#181725",
  },
  subtitle: {
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 15,
    width: 20,
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#181725",
  },
});

export default CartItemRow;
