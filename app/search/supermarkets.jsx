import { useState } from 'react';
import { StyleSheet, TextInput, useColorScheme, View } from 'react-native';

import AppIcon from '@/components/AppIcon';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';

export default function SearchSupermarkets() {
  const [query, setQuery] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        
        <View style={[styles.realSearchBox, { backgroundColor: theme.uiBackground }]}>
          <AppIcon name="explore" size={20} color={theme.iconColor} weight = "bold" />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search Supermarket"
            placeholderTextColor={theme.iconColor}
            value={query}
            onChangeText={setQuery}
            autoFocus={true} 
            returnKeyType="search"
          />
        </View>

      </View>      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop: 10,
  },
  backButton: {
    marginRight: 12,
  },
  realSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});
