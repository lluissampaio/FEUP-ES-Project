import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import ThemedText from "./ThemedText";
import { Minus, Plus } from "phosphor-react-native";
import { getImageForProductCategory } from "@/constants/images";

const CartItemRow = ({ name, price, originalPrice, isPromo, quantity, subtitle, bestStore, onRemove, onIncrement, onDecrement, image_ref }) => {
  const productImage = getImageForProductCategory(image_ref);

  return (
    <View style={styles.card} testID="cart-item">
      <View style={styles.imageContainer}>
        <Image
          source={productImage}
          style={styles.image}
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <View style={styles.infoColumn}>
            <ThemedText style={styles.name}>{name}</ThemedText>
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{bestStore || "Continente"}</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.priceColumn}>
            {isPromo && originalPrice && (
              <ThemedText style={styles.originalPrice}>{originalPrice.toFixed(2)}€</ThemedText>
            )}
            <ThemedText style={styles.currentPrice}>{price.toFixed(2)}€</ThemedText>
            
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                onPress={onDecrement} 
                style={styles.qtyButton}
                testID="decrement-button"
              >
                <Minus size={14} color="#181725" />
              </TouchableOpacity>
              <ThemedText style={styles.qtyText} testID="item-quantity">{quantity}</ThemedText>
              <TouchableOpacity 
                onPress={onIncrement} 
                style={styles.qtyButton}
                testID="increment-button"
              >
                <Plus size={14} color="#53B175" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F3F2",
    backgroundColor: "#fff",
    alignItems: "center",
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
    alignItems: "center",
  },
  infoColumn: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#181725",
  },
  subtitle: {
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 2,
  },
  badgeContainer: {
    marginTop: 8,
    flexDirection: "row",
  },
  badge: {
    backgroundColor: "#F2F3F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#7C7C7C",
    fontWeight: "500",
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  originalPrice: {
    fontSize: 14,
    color: "#B1B1B1",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#53B175",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F3F2",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 10,
  },
  qtyButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 10,
    color: "#181725",
    width: 20,
    textAlign: "center",
  },
});

export default CartItemRow;
