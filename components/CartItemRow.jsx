import { Colors } from "@/constants/colors";
import { getImageForProductCategory } from "@/constants/images";
import { Minus, Plus } from "phosphor-react-native";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import DropdownPill from "./FilterButton";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const CartItemRow = ({
  name,
  price,
  originalPrice,
  isPromo,
  quantity,
  subtitle,
  onRemove,
  onIncrement,
  onDecrement,
  image_ref,
  storeOptions,
  selectedStoreId,
  onStoreSelect,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const productImage = getImageForProductCategory(image_ref);

  const safeOptions =
    storeOptions?.length > 0
      ? storeOptions
      : [{ label: "Sem Loja", value: "none" }];
  const safeSelectedId = selectedStoreId || safeOptions[0].value;

  return (
    <ThemedView
      style={[styles.card, { borderBottomColor: theme.searchBackground }]}
      testID="cart-item"
    >
      <View style={styles.imageContainer}>
        <Image source={productImage} style={styles.image} />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <View style={styles.infoColumn}>
            <ThemedText
              title
              style={[styles.name, { color: theme.title }]}
              numberOfLines={2}
            >
              {name}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.iconColor }]}>
              {subtitle}
            </ThemedText>
          </View>

          <View style={styles.priceColumn}>
            {isPromo && originalPrice != null && (
              <ThemedText
                style={[styles.originalPrice, { color: theme.iconColor }]}
              >
                {originalPrice.toFixed(2)}€
              </ThemedText>
            )}
            <ThemedText
              style={[styles.currentPrice, { color: Colors.primary }]}
            >
              {price?.toFixed(2) ?? "0.00"}€
            </ThemedText>

            <View
              style={[
                styles.quantityControls,
                { backgroundColor: theme.searchBackground },
              ]}
            >
              <TouchableOpacity
                onPress={onDecrement}
                style={styles.qtyButton}
                testID="decrement-button"
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              >
                <Minus size={14} color={Colors.warning} weight="bold" />
              </TouchableOpacity>
              <ThemedText
                style={[styles.qtyText, { color: theme.title }]}
                testID="item-quantity"
              >
                {quantity}
              </ThemedText>
              <TouchableOpacity
                onPress={onIncrement}
                style={styles.qtyButton}
                testID="increment-button"
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              >
                <Plus size={14} color={Colors.primary} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.storeSelector}>
          <DropdownPill
            options={safeOptions}
            selectedValue={safeSelectedId}
            onSelect={(val) => {
              if (val !== "none") onStoreSelect(val);
            }}
          />
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  imageContainer: {
    width: 76,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  image: {
    width: 66,
    height: 66,
    resizeMode: "contain",
  },
  mainContent: {
    flex: 1,
    marginLeft: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoColumn: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  priceColumn: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 22,
    textAlign: "center",
  },
  storeSelector: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
});

export default CartItemRow;
