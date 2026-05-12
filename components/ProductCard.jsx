import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { getImageForProductCategory } from "@/constants/images";
import { Image, Pressable, StyleSheet, View, useColorScheme } from "react-native";
import { Plus } from "phosphor-react-native";
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
  onAdd
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
        
        <ThemedText style={styles.capacity}>
          {formattedCapacity}
        </ThemedText>

        <View style={styles.priceAndAddRow}>
          <View style={styles.priceColumn}>
            {isPromo && originalPrice && (
              <ThemedText style={styles.originalPrice}>
                {originalPrice.toFixed(2)}€
              </ThemedText>
            )}
            <ThemedText style={[styles.currentPrice, { color: Colors.primary }]}>
              {currentPrice.toFixed(2)}€
            </ThemedText>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.addButton, 
              pressed && styles.buttonPressed
            ]} 
            onPress={onAdd}
          >
            <Plus size={18} color="#fff" weight="bold" />
          </Pressable>
        </View>

        {bestStore ? (
          <View style={[styles.badge, { backgroundColor: theme.searchBackground }]}>
            <ThemedText style={styles.badgeText}>
              Melhor preço: <ThemedText style={styles.badgeStoreText}>
                  {bestStore ? bestStore.charAt(0).toUpperCase() + bestStore.slice(1) : ''}
                </ThemedText>
            </ThemedText>
          </View>
        ) : null}
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
    justifyContent: 'space-between',
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
  priceAndAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  priceColumn: {
    flex: 1,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    opacity: 0.5,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    opacity: 0.8,
  },
  badgeStoreText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default ProductCard;