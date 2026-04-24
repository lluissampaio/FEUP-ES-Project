import CartItemRow from "@/components/CartItemRow";
import Spacer from "@/components/Spacer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import useCart from "@/hooks/useCart";
import { FlatList, Alert, StyleSheet, View, TouchableOpacity } from "react-native";
import { Trash, ShoppingCartSimple } from "phosphor-react-native";
import { Colors } from "@/constants/colors";

export default function Cart() {
  const { products, total, error, clear, remove, updateQuantity } = useCart([
    {
      id: "1",
      name: "Morangos",
      price: 4.99,
      subtitle: "1kg, Price",
      image: { uri: '' }
    },
    {
      id: "2",
      name: "Ovos",
      price: 1.99,
      subtitle: "6un, Price",
      image: { uri: '' }
    },
    {
      id: "3",
      name: "Banana",
      price: 3.00,
      subtitle: "1kg, Price",
      image: { uri: '' }
    },
    {
      id: "4",
      name: "Couve-flor",
      price: 2.99,
      subtitle: "250g, Price",
      image: { uri: '' }
    },
  ]);

  if (products.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyState}>
          <ShoppingCartSimple size={80} color={Colors.primary} weight="thin" />
          <Spacer height={24} />
          <ThemedText style={styles.emptyTitle}>O carrinho está vazio</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Adiciona produtos para começares a poupar!
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Cart</ThemedText>
      </View>

      <View style={styles.divider} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            subtitle={item.subtitle}
            image={item.image}
            onRemove={() => remove(item.id)}
            onIncrement={() => updateQuantity(item.id, 1)}
            onDecrement={() => updateQuantity(item.id, -1)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}

        <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
          <ThemedText style={styles.checkoutText}>Checkout</ThemedText>
          <View style={styles.priceBadge}>
            <ThemedText style={styles.priceBadgeText} testID="total-price">
              €{total.toFixed(2)}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#181725",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E2E2",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
  },
  checkoutButton: {
    backgroundColor: "#53B175",
    height: 67,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  priceBadge: {
    backgroundColor: "#489E67",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    position: "absolute",
    right: 20,
  },
  priceBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
