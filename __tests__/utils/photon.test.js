import { searchLocations } from "@/utils/photon";

describe("Serviço Photon API", () => {
  it("deve obter e mapear corretamente os dados da localização", async () => {
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

  it("deve devolver um array vazia para queries pequenas", async () => {
    const results = await searchLocations("ab");
    expect(results).toEqual([]);
  });
});
