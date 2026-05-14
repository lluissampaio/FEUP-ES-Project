import { router, useLocalSearchParams } from "expo-router";
import { useActiveLocation } from "@/hooks/useActiveLocation";
import { useSupermarketDetail } from "@/hooks/useSupermaketDetail";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import AppIcon from "@/components/AppIcon";
import Spacer from "@/components/Spacer";
import { Colors } from "@/constants/colors";
import { getImageForSupermarket } from "@/constants/images";
import {
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

export default function SupermarketDetail() {
  const { id } = useLocalSearchParams();
  const { location: userLocation } = useActiveLocation();
  const { store, loading, error } = useSupermarketDetail(id, userLocation);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AppIcon name="back" size={22} color={theme.iconColorFocused} weight="bold" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : error || !store ? (
        <View style={styles.errorContainer}>
          <AppIcon name="warningCircle" size={48} color={Colors.warning} />
          <Spacer height={16} />
          <ThemedText style={styles.errorText}>Indisponível no momento</ThemedText>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.storeInfo}>
            <Image
              source={getImageForSupermarket(store.name)}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText title style={styles.storeName}>
              {store.name}
            </ThemedText>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: store.isOpen
                      ? Colors.primary + "22"
                      : "#cc475a22",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: store.isOpen ? Colors.primary : "#cc475a" },
                  ]}
                >
                  {store.isOpen ? "Aberto" : "Fechado"}
                </ThemedText>
              </View>
              {store.formattedDistance !== "N/A" && (
                <ThemedText style={styles.distanceText}>
                  {store.formattedDistance}
                </ThemedText>
              )}
            </View>

            {store.address && (
              <View style={styles.addressRow}>
                <AppIcon name="location" size={14} color={theme.iconColor} />
                <ThemedText style={styles.addressText} numberOfLines={2}>
                  {store.address}
                </ThemedText>
              </View>
            )}
          </View>

          <Spacer height={24} />

          <View
            style={[
              styles.scheduleCard,
              {
                backgroundColor: theme.uiBackground,
                borderColor: "rgba(150,150,150,0.1)",
              },
            ]}
          >
            <ThemedText title style={styles.sectionTitle}>
              Horário
            </ThemedText>
            <Spacer height={12} />
            {store.weeklySchedule.map((day, index) => (
              <View
                key={day.dayName}
                style={[
                  styles.scheduleRow,
                  index < store.weeklySchedule.length - 1 && styles.scheduleRowBorder,
                  { borderBottomColor: theme.searchBackground },
                ]}
              >
                <ThemedText
                  style={[styles.dayName, day.isToday && styles.todayHighlight]}
                >
                  {day.dayName}
                </ThemedText>
                <ThemedText
                  style={[styles.dayTime, day.isToday && styles.todayHighlight]}
                >
                  {day.timeRange}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: { marginTop: 40 },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  errorText: { fontSize: 16, opacity: 0.6 },
  content: { paddingHorizontal: 20 },
  storeInfo: { alignItems: "center" },
  logo: { width: 100, height: 100, marginBottom: 16 },
  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 14, fontWeight: "700" },
  distanceText: { fontSize: 14, opacity: 0.7 },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    maxWidth: "80%",
  },
  addressText: { fontSize: 13, opacity: 0.6 },
  scheduleCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  scheduleRowBorder: { borderBottomWidth: 1 },
  dayName: { fontSize: 15, fontWeight: "500" },
  dayTime: { fontSize: 15, fontWeight: "500" },
  todayHighlight: { color: Colors.primary, fontWeight: "700" },
});