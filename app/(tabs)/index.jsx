  import { Colors } from '@/constants/colors';
  import { ScrollView, StyleSheet, View, useColorScheme, ActivityIndicator, TouchableOpacity } from 'react-native';
  import { router } from 'expo-router';

  import AppIcon from '@/components/AppIcon';
  import FakeSearchBar from '@/components/FakeSearchBar';
  import ProductCard from '@/components/ProductCard';
  import Spacer from '@/components/Spacer';
  import ThemedText from '@/components/ThemedText';
  import ThemedView from '@/components/ThemedView';
  import useFeaturedProducts from '@/hooks/useFeaturedProducts';

  export default function Home() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const { products, loading } =  useFeaturedProducts();


    // Computar as melhores promoções
    const bestPromos = products
      .filter(product => product.isPromo === true && product.originalPrice && product.originalPrice > product.currentPrice)
      .map(product => ({
        ...product,
        discountPercent: ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
      }))
      .sort((a, b) => b.discountPercent - a.discountPercent) // Ordenar do maior desconto para o menor
      .slice(0, 6);

    // Computar produtos ecológicos
    const ecoCategories = ['frutas_vegetais', 'mercearia']; // Categorias ecológicas
    const ecoProducts = products
      .filter(product => ecoCategories.includes(product.image_ref))
      .slice(0, 6);


    if(loading) {
      return (
        <ThemedView safe style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </ThemedView>
      );
    }

    return (
      <ThemedView safe style={styles.container}>
        <ScrollView showsVerticalScrollIndicator = {false}>

        <View style={styles.header}>
          <AppIcon name="location" size={24} color={theme.text} weight="fill" />
          <ThemedText title style={styles.locationText}>
            Porto, Portugal
          </ThemedText>
        </View>

        <Spacer height={16} />

        <FakeSearchBar />
        <Spacer height={24} />

          <View style={styles.sectionHeader}>
            <ThemedText title style={styles.sectionTitle}>
              Melhores Promoções
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <ThemedText style={styles.seeAll}>Ver tudo</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {bestPromos.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                formattedCapacity={product.formattedCapacity}
                currentPrice={product.currentPrice}
                originalPrice={product.originalPrice}
                isPromo={product.isPromo}
                bestStore={product.bestStore}
                image_ref={product.image_ref}
                onPress={() => console.log('Produto:', product.name)}
              />
            ))}
          </ScrollView>

          <Spacer height={24} />

          <View style={styles.sectionHeader}>
            <ThemedText title style={styles.sectionTitle}>
              Produtos ecológicos
            </ThemedText>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <ThemedText style={styles.seeAll}>Ver tudo</ThemedText>
              </TouchableOpacity>          
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {ecoProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                formattedCapacity={product.formattedCapacity}
                currentPrice={product.currentPrice}
                originalPrice={product.originalPrice}
                isPromo={product.isPromo}
                bestStore={product.bestStore}
                image_ref={product.image_ref}
                onPress={() => console.log('Produto:', product.name)}
              />
            ))}
          </ScrollView>

          <Spacer height={40} />

        </ScrollView>
      </ThemedView>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    locationText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    seeAll: {
      fontSize: 13,
      color: Colors.primary,
      opacity: 0.8,
    },
    horizontalList: {
      paddingLeft: 12,
      paddingRight: 4,
    },
  })