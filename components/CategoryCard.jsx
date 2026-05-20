// components/CategoryCard.jsx
import { CATEGORY_THEME_MAP } from "@/constants/categories";
import { getImageForProductCategory } from "@/constants/images";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (WINDOW_WIDTH - 48) / 2;

export default function CategoryCard({ config, onPress }) {
  const isDark = useColorScheme() === "dark";
  const colorTheme = CATEGORY_THEME_MAP[config.themeKey] || CATEGORY_THEME_MAP.gray;

  const currentBg = isDark ? colorTheme.darkBg : colorTheme.lightBg;
  const currentTextColor = isDark ? colorTheme.darkText : colorTheme.lightText;

  return (
    <Pressable 
      onPress={onPress}
      testID={`category-card-${config.id}`}
      style={[
        styles.card, 
        { 
          backgroundColor: currentBg, 
          borderColor: colorTheme.border 
        }
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image 
          source={getImageForProductCategory(config.asset)} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.label, { color: currentTextColor }]}>
        {config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 175,
    borderRadius: 18,
    padding: 16,
    margin: 8,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 95,
    height: 85,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
});