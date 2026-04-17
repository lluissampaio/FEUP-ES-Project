// utils/photon.js
const PHOTON_BASE_URL = "https://photon.komoot.io/api";

export const searchLocations = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    // limit to 10 results to avoid clutter
    const response = await fetch(`${PHOTON_BASE_URL}/?q=${encodeURIComponent(query)}&limit=10`);
    const data = await response.json();

    return data.features.map((feature) => ({
      id: feature.properties.osm_id || Math.random().toString(),
      name: feature.properties.name,
      city: feature.properties.city,
      state: feature.properties.state,
      country: feature.properties.country,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],

      displayString: [
        feature.properties.name,
        feature.properties.city,
        feature.properties.country
      ].filter(Boolean).join(", ")
    }));
  } catch (error) {
    console.error("Photon API Error:", error);
    return [];
  }
};