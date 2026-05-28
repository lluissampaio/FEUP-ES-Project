import AppIcon from "@/components/AppIcon";
import { Colors } from "@/constants/colors";
import ThemedText from "@/components/ThemedText";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function SearchInput({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "Pesquisar...",
  style,
  testID,
}) {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <View
      style={[
        styles.searchBox,
        { backgroundColor: theme.searchBackground },
        style,
      ]}
    >
      <AppIcon name="explore" size={20} color={theme.iconColor} weight="bold" />
      <TextInput
        testID={testID}
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.iconColor}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
      {value?.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <ThemedText style={{ fontSize: 18, fontWeight: "700" }}>✕</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});
