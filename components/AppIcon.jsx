import { Colors } from "@/constants/colors";
import { ICON_MAP } from "@/constants/icons";
import React from "react";
import { useColorScheme } from "react-native";

export default function AppIcon({
  name,
  size = 24,
  color,
  weight = "duotone",
  ...props
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.warn(`Ícone "${name}" não está mapeado em constants/icons.js.`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      weight={weight}
      color={color || theme.text}
      {...props}
    />
  );
}
