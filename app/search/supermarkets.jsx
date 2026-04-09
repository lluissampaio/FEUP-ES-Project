import AppIcon from '@/components/AppIcon';
import SupermarketCard from '@/components/SupermarketCard';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

export default function SearchSupermarkets() {
  const [query, setQuery] = useState('');
  
  const theme = Colors[useColorScheme()] ?? Colors.light;

  const { supermarkets, loading } = useSupermarkets(41.177, -8.591);

  const filteredData = useMemo(() => {
    if (!query.trim()) return [];
    return supermarkets.filter((s) => 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, supermarkets]);

  const renderItem = useCallback(({ item }) => (
    <SupermarketCard name={item.name} distance={item.formattedDistance} />
  ), []);

  return (
    <ThemedView safe style={styles.container}>
      <View style={[styles.searchBox, { backgroundColor: theme.searchBackground }]}>
        <AppIcon name="explore" size={20} color={theme.iconColor} weight="bold" />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Pesquisar..."
          placeholderTextColor={theme.iconColor}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <FlashList
            data={filteredData}
            renderItem={renderItem}
            estimatedItemSize={100}
            numColumns={2}
            keyboardDismissMode="on-drag"
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  listContainer: { flex: 1, paddingHorizontal: 8 },
});