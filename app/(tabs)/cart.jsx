import CartItemRow from "@/components/CartItemRow";
import Spacer from "@/components/Spacer";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/colors";
import useCart from "@/hooks/useCart";
import { ShoppingCartSimple } from "phosphor-react-native";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Cart() {
  const { products, total, loading, error, remove, updateQuantity } = useCart();
  const insets = useSafeAreaInsets();

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

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow
            name={item.name}
            price={item.currentPrice}
            originalPrice={item.originalPrice}
            isPromo={item.isPromo}
            quantity={item.quantity}
            subtitle={item.formattedCapacity}
            bestStore={item.bestStore}
            onRemove={() => remove(item.id)}
            onIncrement={() => updateQuantity(item.id, 1)}
            onDecrement={() => updateQuantity(item.id, -1)}
            image_ref={item.image_ref}
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
