import ProductCard from '@/components/ProductCard';
import SearchInput from '@/components/SearchInput';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import useProducts from '@/hooks/useProducts';
import useCart from '@/hooks/useCart';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SearchProducts() {
  const [query, setQuery] = useState('');
  
  const { products, loading, loadMore, loadingMore } = useProducts(query);
  const { addProduct } = useCart();

  const renderItem = useCallback(({ item }) => (
    <ProductCard 
      name={item.name}
      formattedCapacity={item.formattedCapacity}
      currentPrice={item.currentPrice}
      originalPrice={item.originalPrice}
      isPromo={item.isPromo}
      bestStore={item.bestStore}
      image_ref={item.image_ref}
      onPress={() => {}}
      onAdd={() => addProduct(item)}
    />
  ), [addProduct]);

  return (
    <ThemedView safe style={styles.container}>
      <SearchInput 
        value={query} 
        onChangeText={setQuery} 
        placeholder="Pesquisar produtos..."
      />

      <View style={styles.listContainer}>
        {loading && products.length === 0 ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : (
          <FlashList
            data={products}
            renderItem={renderItem}
            estimatedItemSize={320}
            numColumns={2}
            keyboardDismissMode="on-drag"
            
            contentContainerStyle={{ paddingBottom: 100 }}
            
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            
            ListFooterComponent={
              loadingMore 
                ? <ActivityIndicator color={Colors.primary} style={styles.footerLoader} /> 
                : null
            }

            ListEmptyComponent={
              !loading && query ? (
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>Nenhum produto encontrado</ThemedText>
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
    flex: 1 
  },
  listContainer: { 
    flex: 1, 
    paddingHorizontal: 8 
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 40 
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6
  },
  loader: {
    marginTop: 20
  },
  footerLoader: {
    marginVertical: 16
  }
});