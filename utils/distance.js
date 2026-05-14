// Utilizamos a fórmula de Haversine para distâncias em linha reta esférica.
// É uma aproximação suficientemente precisa para este caso de uso e poupa 
// os custos associados a usar APIs de routing pagas
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const formatDistance = (distKm) => {
  if (distKm === null || distKm === undefined) return "N/A";
  if (distKm < 1) return `${Math.round(distKm * 1000)}m`;
  return `${distKm.toFixed(1)} km`;
};