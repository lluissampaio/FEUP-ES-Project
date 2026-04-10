import { calculateDistance } from "@/utils/distance";

describe("Unit Test: Utils de Distância (Haversine)", () => {
  it("A distância para o mesmo ponto deve ser zero", () => {
    const dist = calculateDistance(41.15, -8.61, 41.15, -8.61);
    expect(dist).toBe(0);
  });

  it("Deve calcular a distância correta entre dois pontos conhecidos (ex: Porto a Lisboa)", () => {
    const dist = calculateDistance(41.1579, -8.6291, 38.7223, -9.1393);
    
    expect(dist).toBeCloseTo(274, -1);
  });
});