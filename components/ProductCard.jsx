import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { getImageForProductCategory } from "@/constants/images";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import BaseCard from "./BaseCard";

const ProductCard = ({
  name,
  formattedCapacity,
  currentPrice,
  originalPrice,
  isPromo,
  bestStore,
  image_ref,
  onPress,
}) => {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <BaseCard onPress={onPress} style>
      <Image
        source={getImageForProductCategory(image_ref)}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.infoContainer}>
        <ThemedText title style={styles.name} numberOfLines={2}>
          {name}
        </ThemedText>

        <ThemedText style={styles.capacity}>{formattedCapacity}</ThemedText>

        <View style={styles.priceRow}>
          <ThemedText style={[styles.currentPrice, { color: Colors.primary }]}>
            {currentPrice.toFixed(2)}€
          </ThemedText>

          {isPromo && originalPrice && (
            <ThemedText style={styles.originalPrice}>
              {originalPrice.toFixed(2)}€
            </ThemedText>
          )}
        </View>

        {bestStore ? (
          <View
            style={[styles.badge, { backgroundColor: theme.searchBackground }]}
          >
            <ThemedText style={styles.badgeText}>
              Melhor preço:{" "}
              <ThemedText style={styles.badgeStoreText}>
                {bestStore
                  ? bestStore.charAt(0).toUpperCase() + bestStore.slice(1)
                  : ""}
              </ThemedText>
            </ThemedText>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: Colors.primary },
            pressed && styles.buttonPressed,
          ]}
          onPress={onPress}
        >
          <ThemedText style={styles.buttonText}>Ver Ofertas</ThemedText>
        </Pressable>
      </View>
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 12,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    lineHeight: 20,
  },
  capacity: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    opacity: 0.5,
    textDecorationLine: "line-through",
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    opacity: 0.8,
  },
  badgeStoreText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ProductCard;
