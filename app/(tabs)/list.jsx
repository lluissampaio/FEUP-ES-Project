import CartItemRow from "@/components/ListItemRow";
import DropdownPill from "@/components/FilterButton";
import Spacer from "@/components/Spacer";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/colors";
import useCart from "@/hooks/useCart";
import { useSupermarketsStore } from "@/store/useSupermarketsStore";
import { ShoppingCartSimple } from "phosphor-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Cart() {
  const {
    products,
    total,
    loading,
    error,
    remove,
    updateQuantity,
    updateItemStore,
    updateAllItemsStore,
  } = useCart();

  const { supermarkets, fetchSupermarkets } = useSupermarketsStore();
  const [globalSelectedStore, setGlobalSelectedStore] = useState(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  useEffect(() => {
    fetchSupermarkets();
  }, [fetchSupermarkets]);

  const getStoreName = (storeId) => {
    if (!storeId) return "";
    const found = supermarkets.find((s) => s.id === storeId);
    return (
      found?.name ??
      storeId.charAt(0).toUpperCase() + storeId.slice(1).replace(/-/g, " ")
    );
  };

  const globalStoreOptions = useMemo(() => {
    const allStoreIds = new Set();
    products.forEach((p) => {
      if (p.prices) Object.keys(p.prices).forEach((id) => allStoreIds.add(id));
    });

    const options = Array.from(allStoreIds).map((id) => ({
      label: getStoreName(id),
      value: id,
    }));

    return [{ label: "Melhor Preço (Mix)", value: null }, ...options];
  }, [products, supermarkets]);

  const handleGlobalStoreSelect = (storeId) => {
    setGlobalSelectedStore(storeId);
    updateAllItemsStore(storeId);
  };

  const processedProducts = useMemo(() => {
    return products.map((product) => {
      let price = product.currentPrice ?? 0;
      let originalPrice = product.originalPrice ?? null;
      let isPromo = product.isPromo ?? false;
      let storeId = product.bestStore ?? null;

      if (
        product.selectedStoreId &&
        product.prices?.[product.selectedStoreId]
      ) {
        const storeData = product.prices[product.selectedStoreId];
        price = storeData.current_price;
        isPromo =
          storeData.is_promo === true && storeData.original_price != null;
        originalPrice = isPromo ? storeData.original_price : null;
        storeId = product.selectedStoreId;
      }

      const storeKeys = Object.keys(product.prices ?? {});
      let storeOptions = [];

      if (storeKeys.length > 0) {
        storeOptions = storeKeys.map((id) => ({
          label: getStoreName(id),
          value: id,
        }));
      } else if (storeId) {
        storeOptions = [{ label: getStoreName(storeId), value: storeId }];
      } else {
        storeOptions = [{ label: "Sem Lojas", value: "none" }];
      }

      return {
        ...product,
        displayPrice: price,
        displayOriginalPrice: originalPrice,
        displayIsPromo: isPromo,
        storeOptions,
        activeStoreId: storeId,
      };
    });
  }, [products, supermarkets]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (products.length === 0) {
    return (
      <ThemedView safe style={styles.container}>
        <View style={styles.header}>
          <ThemedText title style={styles.headerTitle}>
            Lista de Compras
          </ThemedText>
        </View>
        <View
          style={[styles.divider, { backgroundColor: theme.searchBackground }]}
        />
        <View style={styles.emptyState}>
          <ShoppingCartSimple size={80} color={Colors.primary} weight="thin" />
          <Spacer height={24} />
          <ThemedText title style={styles.emptyTitle}>
            O seu carrinho está vazio
          </ThemedText>
          <ThemedText
            style={[styles.emptySubtitle, { color: theme.iconColor }]}
          >
            Adicione produtos para começar a poupar!
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <ThemedText title style={styles.headerTitle}>
          Lista de Compras
        </ThemedText>
      </View>

      <View
        style={[styles.divider, { backgroundColor: theme.searchBackground }]}
      />

      <View
        style={[
          styles.globalSelectorContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ThemedText title style={styles.globalSelectorLabel}>
          Poupar em:
        </ThemedText>
        <DropdownPill
          options={globalStoreOptions}
          selectedValue={globalSelectedStore}
          onSelect={handleGlobalStoreSelect}
        />
      </View>

      <View
        style={[styles.divider, { backgroundColor: theme.searchBackground }]}
      />

      <FlatList
        data={processedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow
            name={item.name}
            price={item.displayPrice}
            originalPrice={item.displayOriginalPrice}
            isPromo={item.displayIsPromo}
            quantity={item.quantity}
            subtitle={item.formattedCapacity}
            onRemove={() => remove(item.id)}
            onIncrement={() => updateQuantity(item.id, 1)}
            onDecrement={() => updateQuantity(item.id, -1)}
            image_ref={item.image_ref}
            storeOptions={item.storeOptions}
            selectedStoreId={item.activeStoreId}
            onStoreSelect={(storeId) => updateItemStore(item.id, storeId)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 150 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.searchBackground,
            paddingBottom: 85 + insets.bottom,
          },
        ]}
      >
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        <View style={styles.totalButton}>
          <ThemedText style={styles.totalLabel}>Total Estimado</ThemedText>
          <ThemedText style={styles.totalValue} testID="cart-total-estimated-value">
            {total.toFixed(2)} €
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  divider: {
    height: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  globalSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  globalSelectorLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalButton: {
    backgroundColor: Colors.primary,
    height: 65,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  errorText: {
    color: Colors.warning,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
});