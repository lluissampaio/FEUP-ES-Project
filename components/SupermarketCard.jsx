import ThemedText from "@/components/ThemedText";
import { getLogoForSupermarket } from "@/constants/logos";
import { Image, StyleSheet } from "react-native";
import BaseCard from "./BaseCard";

const SupermarketCard = ({ name, distance, onPress }) => {
  return (
    <BaseCard onPress={onPress}>
      <Image 
        source={getLogoForSupermarket(name)} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <ThemedText title style={styles.name} numberOfLines={2}>
        {name}
      </ThemedText>
      <ThemedText style={styles.details}>{distance}</ThemedText>
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    alignSelf: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    minHeight: 38,
  },
  details: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
});

export default SupermarketCard;