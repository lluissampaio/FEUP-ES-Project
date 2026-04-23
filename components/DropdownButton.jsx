import AppIcon from '@/components/AppIcon';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/colors';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

export default function FilterPill({ label, active, onPress, icon }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const contentColor = active ? '#FFFFFF' : theme.text;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: active ? Colors.primary : theme.searchBackground,
          borderColor: active ? Colors.primary : 'transparent',
        },
      ]}
    >
      {icon && (
        <AppIcon name={icon} size={16} color={contentColor} weight="bold" />
      )}
      <ThemedText style={[styles.pillLabel, { color: contentColor }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});