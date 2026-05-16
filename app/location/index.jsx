import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import AppIcon from '@/components/AppIcon';
import SearchInput from '@/components/SearchInput';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { searchLocations } from '@/utils/photon';

export default function LocationPage() {
  const { location: gpsLocation, isLoading: isGpsLoading, override, setManualLocation, clearOverride, refreshLocation } = useActiveLocation();
  
  const theme = Colors[useColorScheme()] ?? Colors.light;

  const [mode, setMode] = useState('none');
  const [manualLocation, setManualLocationState] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (override) {
      setManualLocationState({ displayString: override.name, latitude: override.lat, longitude: override.lon });
      setMode('manual');
    } else if (gpsLocation) {
      setMode('gps');
    }
  }, [override, gpsLocation]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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

  const handleSelectLocation = useCallback(async (loc) => {
    await setManualLocation(loc);
    setManualLocationState(loc);
    setMode('manual');
    setSearchQuery('');
    setSearchResults([]);
  }, [setManualLocation]);

  const handleRemoveManual = useCallback(async () => {
    await clearOverride();
    setManualLocationState(null);
    setMode(gpsLocation ? 'gps' : 'none');
  }, [clearOverride, gpsLocation]);

  const handleGps = useCallback(() => {
    setManualLocationState(null);
    setMode('gps');
    refreshLocation();
  }, [refreshLocation]);

  const isActive = mode === 'gps' || mode === 'manual';
  const isManual = mode === 'manual';

  const activeCoords = isManual && manualLocation
    ? `${manualLocation.latitude.toFixed(4)}, ${manualLocation.longitude.toFixed(4)}`
    : '';

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" 
      >
        <Spacer height={40} />

        <View style={styles.statusArea}>
          <AppIcon
            name="map"
            size={52}
            weight="fill"
            color={isActive ? "#53B175" : "#cc475a"}
          />
          <Spacer height={16} />
          {isManual ? (
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
        </View>

        <Spacer height={32} />

        {isManual && activeCoords && (
          <View style={styles.cardWrapper}>
            <View style={styles.cardStack}>
              <View style={[styles.locationCard, { backgroundColor: theme.uiBackground }]}>
                <AppIcon name="location" size={22} weight="fill" color="#53B175" />
                <Spacer height={12} />
                <ThemedText title style={styles.cardName} numberOfLines={2}>
                  {manualLocation.displayString}
                </ThemedText>
                <View style={[styles.cardSplitter, { backgroundColor: theme.searchBackground }]} />
                <ThemedText style={styles.cardCoords}>{activeCoords}</ThemedText>
              </View>

              <Pressable 
                onPress={handleRemoveManual} 
                style={({ pressed }) => [styles.removeButton, pressed && styles.removePressed]}
              >
                <ThemedText style={styles.removeButtonText}>Remover</ThemedText>
              </Pressable>
            </View>
          </View>
        )}

        <Spacer height={16} />

        <ThemedButton onPress={handleGps} style={styles.gpsButton}>
          <View style={styles.buttonContent}>
            <AppIcon name="crosshair" size={18} color="#fff" weight="fill" />
            <ThemedText style={styles.buttonText}>Usar localização GPS</ThemedText>
          </View>
        </ThemedButton>

        <Spacer height={36} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>ou pesquisar localização</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <Spacer height={16} />

        <SearchInput
          testID="location-search-input"
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Pesquisar cidade, morada..."
          style={{ marginHorizontal: 0 }}
        />

        <Spacer height={12} />

        {isSearching ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.dimText}>A pesquisar...</ThemedText>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={[styles.resultsListWrapper, { backgroundColor: theme.uiBackground }]}>
            {searchResults.map((loc, index) => (
              <Pressable
                key={loc.id}
                style={({ pressed }) => [
                  styles.resultRow,
                  index !== searchResults.length - 1 && styles.resultSeparator,
                  pressed && { backgroundColor: theme.searchBackground }
                ]}
                onPress={() => handleSelectLocation(loc)}
              >
                <AppIcon name="location" size={18} color={theme.iconColor} weight="light" />
                <ThemedText style={styles.resultTitle} numberOfLines={2}>
                  {loc.displayString}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        ) : searchQuery.length >= 3 && !isSearching ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.dimText}>
              Sem resultados para {searchQuery}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AppIcon name="explore" size={40} style={{ opacity: 0.2 }} />
            <Spacer height={12} />
            <ThemedText style={styles.dimText}>
              Pesquise uma localização para definir manualmente
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusArea: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#53B175',
  },
  inactiveText: {
    color: '#cc475a',
  },
  cardWrapper: {
    alignItems: 'center',
  },
  cardStack: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  locationCard: {
    padding: 20,
    alignItems: 'center',
  },
  cardName: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  cardSplitter: {
    width: '100%',
    height: 1,
    marginVertical: 14,
  },
  cardCoords: {
    fontSize: 13,
    opacity: 0.5,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#cc475a',
    paddingVertical: 14,
  },
  removePressed: {
    opacity: 0.7,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
  resultsListWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  resultSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  resultTitle: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
});