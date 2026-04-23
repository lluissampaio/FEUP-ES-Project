import AppIcon from '@/components/AppIcon';
import { Colors } from '@/constants/colors';
import { StyleSheet, TextInput, useColorScheme, View } from 'react-native';

export default function SearchInput({ value, onChangeText, onSubmitEditing, placeholder = "Pesquisar..." }) {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <View style={[styles.searchBox, { backgroundColor: theme.searchBackground }]}>
      <AppIcon name="explore" size={20} color={theme.iconColor} weight="bold" />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.iconColor}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    minHeight: 56,
  },
  input: { 
    flex: 1,
    marginLeft: 10,
    fontSize: 16 
  }
});