import CartItemRow from "@/components/CartItemRow";
import Spacer from "@/components/Spacer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import useCart from "@/hooks/useCart";
import { FlatList } from "react-native";

export default function Cart() {
  const { products, total, error, clear } = useCart([
    { id: "1", name: "Leite", price: 0.89 },
    { id: "2", name: "Pão", price: 1.2 },
  ]);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText title>Carrinho</ThemedText>
      <Spacer height={16} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow name={item.name} price={item.price} />
        )}
      />

      {products.length > 0 && (
        <ThemedText>Total: {total.toFixed(2)} €</ThemedText>
      )}
      {error && <ThemedText style={{ color: "#cc475a" }}>{error}</ThemedText>}

      <ThemedButton onPress={clear}>
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Limpar
        </ThemedText>
      </ThemedButton>
    </ThemedView>
  );
}
