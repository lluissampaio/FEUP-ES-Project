export const mapDocToProduct = (docSnap) => {
  const dbData = docSnap.data();
  const formattedCapacity = `${dbData.capacity} ${dbData.measurement_unit}`;

  let bestStore = "";
  let currentPrice = 0;
  let originalPrice = null;
  let isPromo = false;

  if (dbData.prices && Object.keys(dbData.prices).length > 0) {
    const [winningStore, winningData] = Object.entries(dbData.prices).reduce(
      (prev, curr) =>
        prev[1].current_price < curr[1].current_price ? prev : curr,
    );
    bestStore = winningStore;
    currentPrice = winningData.current_price;
    isPromo =
      winningData.is_promo === true && winningData.original_price != null;
    originalPrice = isPromo ? winningData.original_price : null;
  }

  return {
    id: docSnap.id,
    name: dbData.name,
    category: dbData.category,
    formattedCapacity,
    capacity: dbData.capacity,
    measurement_unit: dbData.measurement_unit,
    currentPrice,
    unitPrice: dbData.unitPrice,
    originalPrice,
    isPromo,
    bestStore,
    image_ref: dbData.image_ref,
    prices: dbData.prices,
    eco_score: dbData.ecoscore,
    nutri_score: dbData.nutriscore,
  };
};
