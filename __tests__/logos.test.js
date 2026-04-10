import { getLogoForSupermarket, SUPERMARKET_LOGOS } from "@/constants/logos";

describe("Unit Test: Lógica de Mapeamento de Logos", () => {
  it("Deve retornar o logo do Continente para variações do nome", () => {
    expect(getLogoForSupermarket("Continente")).toBe(SUPERMARKET_LOGOS.continente);
    expect(getLogoForSupermarket("continente bom dia")).toBe(SUPERMARKET_LOGOS.continente);
  });

  it("Deve retornar o logo do Pingo Doce ignorando espaços e maiúsculas", () => {
    expect(getLogoForSupermarket("Pingo Doce")).toBe(SUPERMARKET_LOGOS.pingo_doce);
    expect(getLogoForSupermarket("PINGODOCE")).toBe(SUPERMARKET_LOGOS.pingo_doce);
  });

  it("Deve retornar o logo default para supermercados desconhecidos", () => {
    expect(getLogoForSupermarket("Supermercado Default")).toBe(SUPERMARKET_LOGOS.default);
    expect(getLogoForSupermarket("")).toBe(SUPERMARKET_LOGOS.default);
  });
});