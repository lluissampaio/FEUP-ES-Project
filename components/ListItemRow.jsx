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
  scratched = false,
  onToggleScratch,
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
      style={[
        styles.card,
        { borderBottomColor: theme.searchBackground },
        scratched && { backgroundColor: theme.searchBackground },
      ]}
      testID="cart-item"
    >
      <TouchableOpacity
        onPress={onToggleScratch}
        style={styles.checkboxHitArea}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: scratched }}
        testID="item-checkbox"
      >
        <View
          style={[
            styles.checkboxOuter,
            {
              borderColor: scratched ? Colors.primary : theme.iconColor,
              backgroundColor: scratched ? Colors.primary : "transparent",
            },
          ]}
        >
          {scratched && <View style={styles.checkmarkStroke} />}
        </View>
      </TouchableOpacity>

      <View style={[styles.imageContainer, scratched && styles.dimmed]}>
        <Image source={productImage} style={styles.image} />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <View style={styles.infoColumn}>
            <ThemedText
              title
              testID="cart-item-name"
              style={[
                styles.name,
                { color: theme.title },
                scratched && styles.scratchedText,
              ]}
              numberOfLines={2}
            >
              {name}
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                { color: theme.iconColor },
                scratched && styles.scratchedText,
              ]}
            >
              {subtitle}
            </ThemedText>
          </View>

          <View style={styles.priceColumn}>
            {isPromo && originalPrice != null && (
              <ThemedText
                style={[
                  styles.originalPrice,
                  { color: theme.iconColor },
                  scratched && styles.scratchedText,
                ]}
              >
                {originalPrice.toFixed(2)}€
              </ThemedText>
            )}
            <ThemedText
              style={[
                styles.currentPrice,
                { color: scratched ? theme.iconColor : Colors.primary },
                scratched && styles.scratchedText,
              ]}
            >
              {price?.toFixed(2) ?? "0.00"}€
            </ThemedText>

            {scratched ? (
              <ThemedText
                style={[styles.qtySummary, { color: theme.iconColor }]}
              >
                x{quantity}
              </ThemedText>
            ) : (
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
                >
                  <Plus size={14} color={Colors.primary} weight="bold" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {!scratched && (
          <View style={styles.storeSelector}>
            <DropdownPill
              options={safeOptions}
              selectedValue={safeSelectedId}
              onSelect={(val) => {
                if (val !== "none") onStoreSelect(val);
              }}
            />
          </View>
        )}
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
  checkboxHitArea: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkStroke: {
    width: 8,
    height: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#fff",
    transform: [{ rotate: "-45deg" }, { translateY: -1 }],
  },
  scratchedText: {
    textDecorationLine: "line-through",
    opacity: 0.45,
  },
  dimmed: {
    opacity: 0.35,
  },
  imageContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  mainContent: {
    flex: 1,
    marginLeft: 12,
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
  qtySummary: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 6,
  },
  storeSelector: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
});

export default CartItemRow;
