// app/location/index.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import AppIcon from '@/components/AppIcon';
import BaseCard from '@/components/BaseCard';
import SearchInput from '@/components/SearchInput';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useUserLocation } from '@/hooks/useUserLocation';
import { searchLocations } from '@/utils/photon';

export default function LocationPage() {
  const { location: gpsLocation, isLoading: isGpsLoading, error: gpsError, refreshLocation } = useUserLocation();

  const [mode, setMode] = useState('none'); // 'none' | 'gps' | 'manual'
  const [manualLocation, setManualLocation] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceRef = useRef(null);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sync GPS to mode when it arrives and no manual override
  useEffect(() => {
    if (gpsLocation && mode === 'none') {
      setMode('gps');
    }
  }, [gpsLocation, mode]);

  // Debounced fuzzy search
  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchLocations(text);
      setSearchResults(results.slice(0, 5));
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSelectLocation = useCallback((loc) => {
    setManualLocation(loc);
    setMode('manual');
    setSearchQuery('');
    setSearchResults([]);
    // TODO: persist + wire to useSupermarkets
    console.log('Manual location:', { lat: loc.latitude, lon: loc.longitude, name: loc.displayString });
  }, []);

  const handleClearManual = useCallback(() => {
    setManualLocation(null);
    if (gpsLocation) {
      setMode('gps');
    } else {
      setMode('none');
    }
  }, [gpsLocation]);

  const handleGps = useCallback(() => {
    setManualLocation(null);
    setMode('gps');
    refreshLocation();
  }, [refreshLocation]);

  const isManual = mode === 'manual';
  const isActive = mode === 'gps' || mode === 'manual';

  return (
    <ThemedView safe style={styles.container}>
      <Spacer height={80} />

      {/* Centered status */}
      <View style={styles.statusArea}>
        <AppIcon
          name={isActive ? "location" : "warningCircle"}
          size={52}
          weight="fill"
          color={isActive ? "#53B175" : "#cc475a"}
          style={{ opacity: isActive ? 0.6 : 0.35 }}
        />
        <Spacer height={16} />
        {isManual && manualLocation ? (
          <ThemedText style={[styles.statusText, styles.activeText]}>
            Localização manual ativa
          </ThemedText>
        ) : isActive ? (
          <ThemedText style={[styles.statusText, styles.activeText]}>
            Localização GPS ativa
          </ThemedText>
        ) : (
          <ThemedText style={[styles.statusText, styles.inactiveText]}>
            Sem localização definida
          </ThemedText>
        )}
        {gpsError && !isActive && (
          <ThemedText style={styles.errorDetail}>{gpsError}</ThemedText>
        )}
      </View>

      <Spacer height={48} />

      {/* GPS button — hidden when manual is active */}
      {!isManual && (
        <ThemedButton onPress={handleGps} style={styles.gpsButton}>
          <View style={styles.buttonContent}>
            <AppIcon name="crosshair" size={18} color="#fff" weight="fill" />
            <ThemedText style={styles.buttonText}>Usar localização GPS</ThemedText>
          </View>
        </ThemedButton>
      )}

      {/* Manual location card — shown when manual is active */}
      {isManual && manualLocation && (
        <BaseCard style={styles.manualCard}>
          <View style={styles.manualInfo}>
            <AppIcon name="location" size={20} weight="fill" color="#53B175" />
            <View style={{ flex: 1 }}>
              <ThemedText title style={styles.manualName} numberOfLines={2}>
                {manualLocation.displayString}
              </ThemedText>
            </View>
          </View>
          <Pressable onPress={handleClearManual} hitSlop={12}>
            <ThemedText style={styles.changeText}>Alterar</ThemedText>
          </Pressable>
        </BaseCard>
      )}

      {/* Divider + search — only if NOT manual */}
      {!isManual && (
        <>
          <Spacer height={36} />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>ou pesquisar localização</ThemedText>
            <View style={styles.dividerLine} />
          </View>
          <Spacer height={16} />

          <SearchInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Pesquisar cidade, morada..."
          />
        </>
      )}

      <Spacer height={8} />

      {/* Results area */}
      {isSearching ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.dimText}>A pesquisar...</ThemedText>
        </View>
      ) : searchResults.length > 0 ? (
        <View style={styles.resultsList}>
          {searchResults.map((loc) => (
            <BaseCard
              key={loc.id}
              style={styles.resultCard}
              onPress={() => handleSelectLocation(loc)}
            >
              <View style={styles.resultContent}>
                <AppIcon name="location" size={16} style={{ opacity: 0.35 }} />
                <ThemedText title style={styles.resultTitle} numberOfLines={1}>
                  {loc.displayString}
                </ThemedText>
              </View>
            </BaseCard>
          ))}
        </View>
      ) : !isManual && searchQuery.length >= 3 && !isSearching ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.dimText}>
            Sem resultados para &quot;{searchQuery}&quot;
          </ThemedText>
        </View>
      ) : !isManual ? (
        <View style={styles.emptyState}>
          <AppIcon name="explore" size={40} style={{ opacity: 0.2 }} />
          <Spacer height={12} />
          <ThemedText style={styles.dimText}>
            Pesquise uma localização para definir manualmente
          </ThemedText>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusArea: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#53B175',
    opacity: 0.7,
  },
  inactiveText: {
    color: '#cc475a',
    opacity: 0.6,
  },
  errorDetail: {
    fontSize: 12,
    color: '#cc475a',
    opacity: 0.5,
    marginTop: 6,
  },
  gpsButton: {
    borderRadius: 10,
    paddingVertical: 14,
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
  manualCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  manualInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  manualName: {
    fontSize: 14,
  },
  changeText: {
    fontSize: 13,
    color: '#53B175',
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
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  dividerText: {
    fontSize: 13,
    opacity: 0.4,
    marginHorizontal: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  dimText: {
    fontSize: 14,
    opacity: 0.4,
    textAlign: 'center',
  },
  resultsList: {
    gap: 0,
  },
  resultCard: {
    marginVertical: 4,
    marginHorizontal: 0,
    padding: 12,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resultTitle: {
    fontSize: 14,
    flex: 1,
  },
});