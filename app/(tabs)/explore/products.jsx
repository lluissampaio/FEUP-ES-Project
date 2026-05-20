import AppIcon from "@/components/AppIcon";
import ProductCard from "@/components/ProductCard";
import SearchInput from "@/components/SearchInput";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/colors";
import usePaginatedProducts from "@/hooks/useProducts"; // Updated pagination hook path
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, useColorScheme } from "react-native";

export default function CategoryProductsScreen() {
  const params = useLocalSearchParams();
  const categoryId = params.category || "tudo";
  const displayTitle = params.title || "Products";
  
  const theme = Colors[useColorScheme()] ?? Colors.light;

  const [localQuery, setLocalQuery] = useState(params.initialSearch || "");
  const { products, loading, loadMore, loadingMore, hasMore } = usePaginatedProducts(categoryId, localQuery);

  const renderProductItem = useCallback(
    ({ item }) => (
      <ProductCard
        name={item.name}
        formattedCapacity={item.formattedCapacity}
        currentPrice={item.currentPrice}
        originalPrice={item.originalPrice}
        isPromo={item.isPromo}
        bestStore={item.bestStore}
        image_ref={item.image_ref}
        onPress={() =>
          router.push({ pathname: "/product/[id]", params: { id: item.id } })
        }
      />
    ),
    []
  );

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.navigationHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AppIcon name="back" size={24} color={theme.iconColorFocused} weight="bold" />
        </Pressable>
        <ThemedText title style={styles.categoryTitle}>
          {displayTitle}
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <SearchInput
        value={localQuery}
        onChangeText={setLocalQuery}
        placeholder="Procurar Produto"
        style={styles.searchBoxOverride}
      />

      <View style={styles.listWrapper}>
        {loading && products.length === 0 ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.centerSpinner} />
        ) : (
          <FlashList
            data={products}
            renderItem={renderProductItem}
            estimatedItemSize={320}
            numColumns={2}
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.scrollPadding}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator color={Colors.primary} style={styles.footerSpinner} />
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    Nenhum produto encontrado
                  </ThemedText>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  searchBoxOverride: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 12,
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  scrollPadding: {
    paddingBottom: 120,
  },
  centerSpinner: {
    marginTop: 40,
  },
  footerSpinner: {
    marginVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.5,
  },
});