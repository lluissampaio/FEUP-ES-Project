import CartItemRow from "@/components/CartItemRow";
import DropdownPill from "@/components/FilterButton";
import Spacer from "@/components/Spacer";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/colors";
import { useSupermarkets } from "@/hooks/useSupermarkets";
import useCart from "@/hooks/useCart";
import { ShoppingCartSimple } from "phosphor-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Cart() {
  const { products, total, loading, error, remove, updateQuantity, updateItemStore, updateAllItemsStore } = useCart();
  const { supermarkets } = useSupermarkets();
  const [globalSelectedStore, setGlobalSelectedStore] = useState(null);
  const insets = useSafeAreaInsets();

  const globalStoreOptions = useMemo(() => {
    const allStoreIds = new Set();
    products.forEach((p) => {
      if (p.prices) {
        Object.keys(p.prices).forEach((id) => allStoreIds.add(id));
      }
    });

    const options = Array.from(allStoreIds).map((id) => {
      const foundStore = supermarkets.find((s) => s.id === id);
      return {
        label: foundStore?.name || (id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ") : id),
        value: id,
      };
    });

    return [{ label: "Melhor Preço (Mix)", value: null }, ...options];
  }, [products, supermarkets]);

  const handleGlobalStoreSelect = (storeId) => {
    setGlobalSelectedStore(storeId);
    updateAllItemsStore(storeId);
  };

  const processedProducts = useMemo(() => {
    return products.map((product) => {
      let price = product.currentPrice;
      let originalPrice = product.originalPrice;
      let isPromo = product.isPromo;
      let storeId = product.bestStore;

      if (product.selectedStoreId && product.prices && product.prices[product.selectedStoreId]) {
        const storeData = product.prices[product.selectedStoreId];
        price = storeData.current_price;
        isPromo = storeData.is_promo === true && storeData.original_price != null;
        originalPrice = isPromo ? storeData.original_price : null;
        storeId = product.selectedStoreId;
      }

      const foundStore = supermarkets.find((s) => s.id === storeId);
      const storeName = foundStore?.name || (storeId ? (storeId.charAt(0).toUpperCase() + storeId.slice(1).replace(/-/g, " ")) : "Supermercado");

      const storeOptions = Object.keys(product.prices || {}).map((id) => {
        const supermarket = supermarkets.find((s) => s.id === id);
        return {
          label: supermarket?.name || (id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ") : id),
          value: id,
        };
      });

      return {
        ...product,
        displayPrice: price,
        displayOriginalPrice: originalPrice,
        displayIsPromo: isPromo,
        displayStore: storeName,
        storeOptions: storeOptions,
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
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Lista de Compras</ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.emptyState}>
          <ShoppingCartSimple size={80} color={Colors.primary} weight="thin" />
          <Spacer height={24} />
          <ThemedText style={styles.emptyTitle}>O seu carrinho está vazio</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Adicione produtos para começar a poupar!
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Lista de Compras</ThemedText>
      </View>

      <View style={styles.divider} />

      <View style={styles.globalSelectorContainer}>
        <ThemedText style={styles.globalSelectorLabel}>Poupar em:</ThemedText>
        <DropdownPill
          options={globalStoreOptions}
          selectedValue={globalSelectedStore}
          onSelect={handleGlobalStoreSelect}
        />
      </View>

      <View style={styles.divider} />

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
            bestStore={item.displayStore}
            onRemove={() => remove(item.id)}
            onIncrement={() => updateQuantity(item.id, 1)}
            onDecrement={() => updateQuantity(item.id, -1)}
            image_ref={item.image_ref}
            storeOptions={item.storeOptions}
            selectedStoreId={item.activeStoreId}
            onStoreSelect={(storeId) => updateItemStore(item.id, storeId)}
          />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: 150 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { paddingBottom: 85 + insets.bottom }]}>
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}

        <View style={styles.totalButton}>
          <ThemedText style={styles.totalLabel}>Total Estimado</ThemedText>
          <ThemedText style={styles.totalValue}>{total.toFixed(2)} €</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#181725",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E2E2",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  globalSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  globalSelectorLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#181725",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F2F3F2",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalButton: {
    backgroundColor: "#53B175",
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
    color: "#cc475a",
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});
