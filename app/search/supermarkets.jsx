// app/search/supermarkets.jsx
import SearchInput from '@/components/SearchInput';
import SupermarketCard from '@/components/SupermarketCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SearchSupermarkets() {
  const [query, setQuery] = useState('');
  
  const { location: userLocation, isLoading: isFetchingLocation } = useActiveLocation();
  const { supermarkets, loading: isSupermarketsLoading } = useSupermarkets(userLocation);

  const filteredData = useMemo(() => {
    return supermarkets.filter((s) => 
      s.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query, supermarkets]);

  const renderItem = useCallback(({ item }) => (
    <SupermarketCard 
      name={item.name} 
      distance={item.formattedDistance} 
      isOpen={item.isOpen} 
      scheduleToday={item.scheduleToday} 
    />
  ), []);

  const isLoading = isFetchingLocation || isSupermarketsLoading;

  return (
    <ThemedView safe style={styles.container}>
      
      <SearchInput 
        value={query} 
        onChangeText={setQuery} 
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <FlashList
            data={filteredData}
            renderItem={renderItem}
            estimatedItemSize={100}
            numColumns={2}
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>Nenhuma loja encontrada</ThemedText>
              </View>
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
});