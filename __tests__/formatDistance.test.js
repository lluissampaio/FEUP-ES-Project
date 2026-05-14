import { formatDistance } from "@/utils/distance";

describe("Unit Test: formatDistance", () => {
  it("Deve retornar 'N/A' para null", () => {
    expect(formatDistance(null)).toBe("N/A");
  });

  it("Deve retornar 'N/A' para undefined", () => {
    expect(formatDistance(undefined)).toBe("N/A");
  });

  it("Deve retornar metros para distâncias menores que 1 km", () => {
    expect(formatDistance(0)).toBe("0m");
    expect(formatDistance(0.1)).toBe("100m");
    expect(formatDistance(0.5)).toBe("500m");
  });

  it("Deve arredondar metros corretamente", () => {
    expect(formatDistance(0.999)).toBe("999m");
    expect(formatDistance(0.3001)).toBe("300m");
  });

  it("Deve retornar km com 1 casa decimal para distâncias >= 1 km", () => {
    expect(formatDistance(1)).toBe("1.0 km");
    expect(formatDistance(1.5)).toBe("1.5 km");
    expect(formatDistance(274.45)).toBe("274.5 km");
  });
});