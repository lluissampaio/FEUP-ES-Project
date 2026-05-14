import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/colors';
import { getImageForSupermarket } from '@/constants/images';
import { memo } from 'react';
import { Image, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

/* Wrapped in React.memo: re-renders only when its own props change.
Combined with a stable `onPress` ref in the parent (useCallback with empty
deps), this ensures only the two cards that gain/lose `isSelected` are
processed by the JS thread on each selection tap.
*/
 
const PriceCard = memo(function PriceCard({
  storeKey,
  currentPrice,
  originalPrice,
  isPromo,
  isBestChoice = false,
  isSelected = false,
  onPress,
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const storeName = storeKey
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const borderColor = isSelected
    ? theme.iconColorFocused
    : isBestChoice
    ? Colors.primary
    : theme.searchBackground;

  const borderWidth = isSelected || isBestChoice ? 2 : 1;

  const backgroundColor =
    isBestChoice && !isSelected
      ? colorScheme === 'dark'
        ? '#1a2e1a'
        : '#F4FBF4'
      : theme.uiBackground;

  return (
    <Pressable
      onPress={() => onPress(storeKey)}
      style={({ pressed }) => [
        styles.card,
        { borderColor, borderWidth, backgroundColor },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Selecionar ${storeName}, ${currentPrice.toFixed(2)} euros`}
      accessibilityState={{ selected: isSelected }}
    >
      {isBestChoice && (
        <View style={styles.bestBanner}>
          <ThemedText style={styles.bestBannerText}>MELHOR ESCOLHA</ThemedText>
        </View>
      )}

      <View style={styles.storeRow}>
        <Image
          source={getImageForSupermarket(storeKey)}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.storeInfo}>
          <ThemedText style={styles.storeName}>{storeName}</ThemedText>
        </View>
      </View>

      <View style={styles.priceBlock}>
        {isPromo && originalPrice != null && (
          <ThemedText style={styles.strikePrice}>
            {originalPrice.toFixed(2)}€
          </ThemedText>
        )}
        <ThemedText
          style={[styles.price, isBestChoice && { color: Colors.primary }]}
        >
          {currentPrice.toFixed(2)}€
        </ThemedText>
      </View>
    </Pressable>
  );
});

export default PriceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.75,
  },
  bestBanner: {
    position: 'absolute',
    top: -11,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bestBannerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  storeRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  storeInfo: {
    flex: 1,
    gap: 3,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
  },
  unitPrice: {
    fontSize: 12,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  strikePrice: {
    fontSize: 13,
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },
});