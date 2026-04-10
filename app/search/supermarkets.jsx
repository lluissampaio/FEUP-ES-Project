import AppIcon from '@/components/AppIcon';
import SupermarketCard from '@/components/SupermarketCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constants/colors';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { FlashList } from '@shopify/flash-list';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

export default function SearchSupermarkets() {
  const [query, setQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  
  const theme = Colors[useColorScheme()] ?? Colors.light;

  useEffect(() => {
    // Flag de mitigação de Memory Leaks. Previne que o estado
    // seja atualizado se o componente já tiver sido desmontado durante o loading
    let isMounted = true;

    async function getUserLocation() {
      try {
        // Otimização de ciclo: get() valida silenciosamente
        // Evita invocar o request() desnecessariamente se já tivermos permissão
        let { status } = await Location.getForegroundPermissionsAsync();
        
        //Ler da cache resolve o pedido em 0ms.
        // Apenas recorremos à antena GPS se a cache do OS estiver vazia.
        if (status !== 'granted') {
          const request = await Location.requestForegroundPermissionsAsync();
          status = request.status;
        }

        if (status !== 'granted') {
          if (isMounted) setIsFetchingLocation(false);
          return;
        }

        let location = await Location.getLastKnownPositionAsync();

        if (!location) {
          const locationPromise = Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Timeout: Erro no GPS")), 5000);
          });

          // Workaround arquitetural para o bug "Permitir uma vez" do iOS/Android.
          // Força a libertação da thread UI se o SO encravar o acesso ao hardware.
          location = await Promise.race([locationPromise, timeoutPromise]);
        }
        
        if (isMounted && location) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }

      } catch (error) {
        console.warn("Aviso GPS (A usar fallback sem distância):", error.message);
      } finally {
        if (isMounted) setIsFetchingLocation(false);
      }
    }

    getUserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const { supermarkets, loading: isSupermarketsLoading } = useSupermarkets(
    userLocation?.latitude,
    userLocation?.longitude
  );

  // useMemo protege contra re-renderizações complexas do filtro ao digitar.
  const filteredData = useMemo(() => {
    return supermarkets.filter((s) => 
      s.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query, supermarkets]);

  // useCallback estabiliza a referência da função para a FlashList.
  // Evita que os cartões sofram re-renderizações de memória em cada scroll.
  const renderItem = useCallback(({ item }) => (
    <SupermarketCard 
      name={item.name} 
      distance={item.formattedDistance} 
      isOpen={item.isOpen} 
      scheduleToday={item.scheduleToday} 
    />
  ), []);

  const isLoading = isFetchingLocation || isSupermarketsLoading;

  return (
    <ThemedView safe style={styles.container}>
      <View style={[styles.searchBox, { backgroundColor: theme.searchBackground }]}>
        <AppIcon name="explore" size={20} color={theme.iconColor} weight="bold" />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Pesquisar..."
          placeholderTextColor={theme.iconColor}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <FlashList
            data={filteredData}
            renderItem={renderItem}
            estimatedItemSize={100}
            numColumns={2}
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>Nenhuma loja encontrada</ThemedText>
              </View>
            }
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  searchBox: {
     flexDirection: 'row',
      alignItems: 'center', 
      margin: 16, 
      borderRadius: 12, 
      paddingHorizontal: 16, 
      paddingVertical: 3 
  },
  input: { 
    flex: 1,
     marginLeft: 10,
      fontSize: 16 
  },
  listContainer: {
     flex: 1,
    paddingHorizontal: 8 
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 40 
  },
  emptyText: { 
    fontSize: 16, 
    opacity: 0.6 
  },
});