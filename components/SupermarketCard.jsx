import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { getImageForSupermarket } from "@/constants/images";
import { Image, StyleSheet } from "react-native";
import BaseCard from "./BaseCard";

const SupermarketCard = ({ name, distance, isOpen, scheduleToday, onPress, testID }) => {
  return (
    <BaseCard onPress={onPress} testID={testID}>
      <Image 
        source={getImageForSupermarket(name)} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <ThemedText title style={styles.name} numberOfLines={2}>
        {name}
      </ThemedText>
      <ThemedText title style={[styles.status, { color: isOpen ? Colors.primary : '#cc475a' }]}>
        {isOpen ? "Aberto" : "Fechado"}
      </ThemedText>
      {scheduleToday && (
        <ThemedText style={styles.details}>Hoje: {scheduleToday}</ThemedText>
      )}
      {distance && distance !== "N/A" && (
        <ThemedText style={styles.details}>{distance}</ThemedText>
      )}
      <ThemedText style={styles.seeMore}>Ver mais</ThemedText>
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
  status: { 
    fontSize: 13, fontWeight: "bold", textAlign: "center", marginBottom: 2 
  },
  seeMore: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});

export default SupermarketCard;