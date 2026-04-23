// app/location/index.jsx
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import AppIcon from '@/components/AppIcon';
import BaseCard from '@/components/BaseCard';
import SearchInput from '@/components/SearchInput';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useUserLocation } from '@/hooks/useUserLocation';

export default function LocationPage() {
  const { location, isLoading, error, refreshLocation } = useUserLocation();

  const locationDisplay = location
    ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    : 'Indisponível';

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={16}>
          <AppIcon name="back" size={24} />
        </Pressable>
        <ThemedText title style={styles.headerTitle}>
          Localização
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <Spacer height={24} />

      <BaseCard style={styles.currentLocationCard}>
        <AppIcon name="location" size={20} weight="fill" />
        <View style={styles.locationInfo}>
          <ThemedText style={styles.locationLabel}>Localização atual</ThemedText>
          <ThemedText title style={styles.locationValue}>
            {locationDisplay}
          </ThemedText>
        </View>
        {isLoading && <ActivityIndicator size="small" color="#53B175" />}
      </BaseCard>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}

      <Spacer height={16} />

      <ThemedButton
        style={styles.gpsButton}
        onPress={refreshLocation}
        disabled={isLoading}
      >
        <View style={styles.buttonContent}>
          <AppIcon name="crosshair" size={18} color="#fff" weight="fill" />
          <ThemedText style={styles.buttonText}>Usar localização GPS</ThemedText>
        </View>
      </ThemedButton>

      <Spacer height={32} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <ThemedText style={styles.dividerText}>ou pesquisar localização</ThemedText>
        <View style={styles.dividerLine} />
      </View>

      <Spacer height={16} />

      <SearchInput
        value=""
        onChangeText={() => {}}
        placeholder="Pesquisar cidade, morada..."
      />

      <Spacer height={16} />

      <View style={styles.emptyState}>
        <AppIcon name="explore" size={40} />
        <Spacer height={12} />
        <ThemedText style={styles.emptyText}>
          Pesquise uma localização para definir manualmente
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  locationValue: {
    fontSize: 15,
  },
  errorText: {
    fontSize: 13,
    color: '#cc475a',
    marginTop: 8,
  },
  gpsButton: {
    borderRadius: 10,
    paddingVertical: 14,
    opacity: undefined,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
  },
  dividerText: {
    fontSize: 13,
    opacity: 0.5,
    marginHorizontal: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});