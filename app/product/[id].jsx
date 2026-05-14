import AppIcon from '@/components/AppIcon';
import PriceCard from '@/components/PriceCard';
import Spacer from '@/components/Spacer';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import { getImageForProductCategory } from '@/constants/images';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

import { useProductDetail } from '@/hooks/useProductDetails';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const {
    product,
    loading,
    selectedStoreKey,
    sortedPrices,
    totalPrice,
    handleSelectStore,
  } = useProductDetail(id);

  if (loading) {
    return (
      <ThemedView safe style={styles.centred}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView safe style={styles.centred}>
        <AppIcon name="warningCircle" size={44} color={Colors.warning} />
        <Spacer height={12} />
        <ThemedText style={[styles.errorText, { color: theme.iconColor }]}>
          Produto não encontrado.
        </ThemedText>
      </ThemedView>
    );
  }

  const metaSegments = [capitalizeFirstLetter(product.category), product.formattedCapacity].filter(Boolean);

  return (
    <ThemedView safe style={styles.container}>

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressedOpacity]}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <AppIcon name="back" size={22} color={theme.iconColorFocused} weight="bold" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/*  Product image  */}
        <Image
          source={getImageForProductCategory(product.image_ref)}
          style={styles.productImage}
          resizeMode="contain"
          accessibilityLabel={product.name}
        />

        {/*  Product identity  */}
        <ThemedText title style={styles.productName}>
          {product.name}
        </ThemedText>

        {metaSegments.length > 0 && (
          <ThemedText style={[styles.productMeta, { color: theme.iconColor }]}>
            {metaSegments.join(' • ')}
          </ThemedText>
        )}

        <Spacer height={24} />

        {/*  Price comparison  */}
        {sortedPrices.length > 0 && (
          <>
            <ThemedText title style={styles.sectionTitle}>
              Comparar Preços
            </ThemedText>
            <Spacer height={18} />

            {sortedPrices.map(([storeKey, priceData], index) => (
              <PriceCard
                key={storeKey}
                storeKey={storeKey}
                currentPrice={priceData.current_price}
                originalPrice={priceData.original_price}
                isPromo={priceData.is_promo}
                isBestChoice={index === 0}
                isSelected={selectedStoreKey === storeKey}
                onPress={handleSelectStore}
              />
            ))}
          </>
        )}

        <Spacer height={110} />
      </ScrollView>

      {/*  Footer CTA  */}
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.background, borderTopColor: theme.searchBackground },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.pressedOpacity]}
          accessibilityRole="button"
        >
          <ThemedText style={styles.addButtonLabel}>
            {'Adicionar à Lista'}
          </ThemedText>

          <ThemedText style={styles.addButtonPrice}>
            {totalPrice.toFixed(2)}€
          </ThemedText>
        </Pressable>
      </View>

    </ThemedView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedOpacity: {
    opacity: 0.55,
  },

  scroll: {
    paddingHorizontal: 20,
  },

  productImage: {
    width: '100%',
    height: 210,
    marginVertical: 12,
  },
  productName: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  productMeta: {
    fontSize: 15,
    marginTop: 5,
  },
  scoresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 17,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  addButtonPrice: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});