import AppIcon from "@/components/AppIcon";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

export default function DropdownPill({
  options,
  selectedValue,
  onSelect,
  icon,
}) {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const active = selectedValue !== null && selectedValue !== undefined;
  const selectedLabel =
    options?.find((o) => o.value === selectedValue)?.label ?? options?.[0]?.label ?? "Carregando...";

  const contentColor = active ? "#FFFFFF" : theme.text;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.pill,
          {
            backgroundColor: active ? Colors.primary : theme.searchBackground,
            borderColor: active ? Colors.primary : "transparent",
          },
        ]}
      >
        {icon && (
          <AppIcon name={icon} size={16} color={contentColor} weight="bold" />
        )}
        <ThemedText style={[styles.pillLabel, { color: contentColor }]}>
          {selectedLabel}
        </ThemedText>
        <ThemedText style={[styles.pillChevron, { color: contentColor }]}>
          ▾
        </ThemedText>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.dropdownMenu,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    isSelected && { backgroundColor: Colors.primary + "22" },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.dropdownItemText,
                      isSelected && {
                        color: Colors.primary,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  pillChevron: {
    fontSize: 11,
    marginLeft: 2,
    opacity: 0.8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    paddingTop: 160,
    paddingHorizontal: 16,
  },
  dropdownMenu: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: "flex-start",
    minWidth: 140,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
