import { searchLocations } from "@/utils/photon";

describe("Serviço Photon API", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve obter e mapear corretamente os dados da localização", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        features: [
          {
            properties: {
              osm_id: 123456,
              name: "Porto",
              city: "Porto",
              state: "Porto",
              country: "Portugal",
            },
            geometry: {
              coordinates: [-8.6291, 41.1579],
            },
          },
        ],
      }),
    });

    const results = await searchLocations("Porto");

    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      const firstResult = results[0];

      expect(firstResult).toHaveProperty("latitude");
      expect(firstResult).toHaveProperty("longitude");
      expect(firstResult).toHaveProperty("displayString");
      expect(firstResult).toHaveProperty("name");

      expect(typeof firstResult.latitude).toBe("number");
      expect(typeof firstResult.longitude).toBe("number");
      expect(typeof firstResult.displayString).toBe("string");

      expect(firstResult.latitude).toBeGreaterThanOrEqual(-90);
      expect(firstResult.latitude).toBeLessThanOrEqual(90);
    }
  });

  it("deve devolver um array vazio para queries pequenas", async () => {
    const results = await searchLocations("ab");
    expect(results).toEqual([]);
  });
});