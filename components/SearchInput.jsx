import AppIcon from '@/components/AppIcon';
import { Colors } from '@/constants/colors';
import { StyleSheet, TextInput, useColorScheme, View } from 'react-native';

export default function SearchInput({ value, onChangeText, placeholder = "Pesquisar..." }) {
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center', 
    margin: 16, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  input: { 
    flex: 1,
    marginLeft: 10,
    fontSize: 16 
  }
});