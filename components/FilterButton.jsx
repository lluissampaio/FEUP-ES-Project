import AppIcon from "@/components/AppIcon";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DropdownPill({
  options,
  selectedValue,
  onSelect,
  icon,
  testID,
}) {
  const [open, setOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState(null);
  const pillRef = useRef(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const active = selectedValue !== null && selectedValue !== undefined;
  const safeOptions =
    options?.length > 0 ? options : [{ label: "Sem Opções", value: "none" }];
  const selectedLabel =
    safeOptions.find((o) => o.value === selectedValue)?.label ??
    safeOptions[0].label;

  const contentColor = active ? "#FFFFFF" : theme.text;

  const handleOpen = () => {
    setOpen(true);
    if (
      pillRef.current &&
      typeof pillRef.current.measureInWindow === "function"
    ) {
      pillRef.current.measureInWindow((x, y, width, height) => {
        const dropdownWidth = Math.max(width, 160);
        const maxLeft = SCREEN_WIDTH - dropdownWidth - 16;
        const safeX = Math.min(x, maxLeft);

        setDropdownLayout({
          x: safeX,
          y: y + height + 6,
          width: dropdownWidth,
        });
      });
    }
  };

  return (
    <>
      <Pressable
        ref={pillRef}
        testID={testID}
        onPress={handleOpen}
        disabled={!options || options.length === 0}
        style={[
          styles.pill,
          {
            backgroundColor: active ? Colors.primary : theme.searchBackground,
            borderColor: active ? Colors.primary : "transparent",
            opacity: !options || options.length === 0 ? 0.5 : 1,
          },
        ]}
      >
        {icon && (
          <AppIcon name={icon} size={16} color={contentColor} weight="bold" />
        )}
        <ThemedText
          style={[styles.pillLabel, { color: contentColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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
              dropdownLayout && {
                position: "absolute",
                top: dropdownLayout.y,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
              },
            ]}
          >
            {safeOptions.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <Pressable
                  key={String(option.value)}
                  testID={`filter-option-${option.value}`} // Anchors Detox strictly to this node
                  onPress={() => {
                    if (option.value !== "none") {
                      onSelect(option.value);
                    }
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
                    numberOfLines={1}
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
    minWidth: 70,
    maxWidth: 130,
    textAlign: "center",
  },
  pillChevron: {
    fontSize: 11,
    marginLeft: 2,
    opacity: 0.8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  dropdownMenu: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "500",
  },
});