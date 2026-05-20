import CategoryCard from "@/components/CategoryCard";
import SearchInput from "@/components/SearchInput";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { CATEGORY_GRID_DATA } from "@/constants/categories";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ExploreCategoriesScreen() {
  const [globalQuery, setGlobalQuery] = useState("");

  const handleGlobalSearchSubmit = () => {
    if (!globalQuery.trim()) return;
    router.push({
      pathname: "/(tabs)/explore/products",
      params: { category: "tudo", initialSearch: globalQuery.trim() },
    });
  };

  const handleCategoryPress = (categoryItem) => {
    router.push({
      pathname: "/(tabs)/explore/products",
      params: { category: categoryItem.id, title: categoryItem.label },
    });
  };

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <ThemedText title style={styles.headerTitle}>
          Encontra Produtos
        </ThemedText>
      </View>

      <SearchInput
        value={globalQuery}
        onChangeText={setGlobalQuery}
        onSubmitEditing={handleGlobalSearchSubmit}
        placeholder="Search Store"
        style={styles.searchOverride}
      />

      <View style={styles.gridContainer}>
        <FlashList
          testID="categories-flashlist"
          data={CATEGORY_GRID_DATA}
          renderItem={({ item }) => (
            <CategoryCard
              config={item}
              onPress={() => handleCategoryPress(item)}
            />
          )}
          estimatedItemSize={190}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  searchOverride: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
});