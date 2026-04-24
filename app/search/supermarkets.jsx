import FilterPill from '@/components/DropdownButton';
import DropdownPill from '@/components/FilterButton';
import SearchInput from '@/components/SearchInput';
import SupermarketCard from '@/components/SupermarketCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { DISTANCE_OPTIONS, useSupermarketFilters } from '@/hooks/useSupermarketFilters';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SearchSupermarkets() {
  const { location: userLocation, isLoading: isFetchingLocation } = useActiveLocation();
  const { supermarkets, loading: isSupermarketsLoading } = useSupermarkets(userLocation);

  const {
    query,
    setQuery,
    isOpenFilter,
    setIsOpenFilter,
    distanceFilter,
    setDistanceFilter,
    filteredData,
  } = useSupermarketFilters(supermarkets);

  const renderItem = useCallback(
    ({ item }) => (
      <SupermarketCard
        name={item.name}
        distance={item.formattedDistance}
        isOpen={item.isOpen}
        scheduleToday={item.scheduleToday}
      />
    ),
    [],
  );

  const isLoading = isFetchingLocation || isSupermarketsLoading;

  return (
    <ThemedView safe style={styles.container}>
      
      <ThemedView style={styles.headerWrapper}>
        <SearchInput value={query} onChangeText={setQuery} />

        <View style={styles.filterRow}>
          <DropdownPill
            icon="ruler"
            options={DISTANCE_OPTIONS}
            selectedValue={distanceFilter}
            onSelect={setDistanceFilter}
          />
          <FilterPill
            icon="lock-simple-open"
            label="Aberto"
            active={isOpenFilter}
            onPress={() => setIsOpenFilter((prev) => !prev)}
          />
        </View>
      </ThemedView>

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlashList
            data={filteredData}
            renderItem={renderItem}
            estimatedItemSize={100}
            numColumns={2}
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.listContent}
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
    flex: 1,
  },
  headerWrapper: {
    zIndex: 10,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingTop: 8, 
    paddingBottom: 20, 
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});