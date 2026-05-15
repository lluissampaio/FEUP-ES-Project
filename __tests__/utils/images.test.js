import {
  getImageForProductCategory,
  getImageForSupermarket,
  PRODUCT_IMAGES,
  SUPERMARKET_IMAGES,
} from "@/constants/images";

describe("Unit Test: Lógica de Mapeamento de Imagens", () => {
  describe("Imagens de Supermercados", () => {
    it("Deve retornar a imagem do Continente para variações do nome", () => {
      expect(getImageForSupermarket("Continente")).toBe(
        SUPERMARKET_IMAGES.continente,
      );
      expect(getImageForSupermarket("continente bom dia")).toBe(
        SUPERMARKET_IMAGES.continente,
      );
    });

    it("Deve retornar a imagem do Pingo Doce ignorando espaços e maiúsculas", () => {
      expect(getImageForSupermarket("Pingo Doce")).toBe(
        SUPERMARKET_IMAGES.pingo_doce,
      );
      expect(getImageForSupermarket("PINGODOCE")).toBe(
        SUPERMARKET_IMAGES.pingo_doce,
      );
    });

    it("Deve retornar a imagem default para supermercados desconhecidos ou nulos", () => {
      expect(getImageForSupermarket("Supermercado Inexistente")).toBe(
        SUPERMARKET_IMAGES.default,
      );
      expect(getImageForSupermarket("")).toBe(SUPERMARKET_IMAGES.default);
      expect(getImageForSupermarket(null)).toBe(SUPERMARKET_IMAGES.default);
      expect(getImageForSupermarket(undefined)).toBe(
        SUPERMARKET_IMAGES.default,
      );
    });
  });

  describe("Imagens de Categorias de Produtos", () => {
    it("Deve mapear corretamente categorias básicas ignorando maiúsculas", () => {
      expect(getImageForProductCategory("Bebidas")).toBe(
        PRODUCT_IMAGES.bebidas,
      );
      expect(getImageForProductCategory("SNACK")).toBe(PRODUCT_IMAGES.snacks);
      expect(getImageForProductCategory("Mercearia")).toBe(
        PRODUCT_IMAGES.mercearia,
      );
    });

    it("Deve normalizar acentos e caracteres especiais corretamente", () => {
      expect(getImageForProductCategory("Laticínios")).toBe(
        PRODUCT_IMAGES.leite,
      );
      expect(getImageForProductCategory("Frutas & Vegetais")).toBe(
        PRODUCT_IMAGES.frutas_vegetais,
      );
    });

    it("Deve suportar múltiplas palavras-chave para a mesma categoria", () => {
      // Carne e Talho apontam para a mesma imagem
      expect(getImageForProductCategory("Carne de Vaca")).toBe(
        PRODUCT_IMAGES.talho,
      );
      expect(getImageForProductCategory("Talho")).toBe(PRODUCT_IMAGES.talho);

      // Peixe e Peixaria apontam para a mesma imagem
      expect(getImageForProductCategory("Peixe Fresco")).toBe(
        PRODUCT_IMAGES.peixaria,
      );
      expect(getImageForProductCategory("Peixaria")).toBe(
        PRODUCT_IMAGES.peixaria,
      );
    });

    it("Deve retornar a imagem default para categorias desconhecidas ou nulas", () => {
      expect(getImageForProductCategory("Eletrónica")).toBe(
        PRODUCT_IMAGES.default,
      );
      expect(getImageForProductCategory("")).toBe(PRODUCT_IMAGES.default);
      expect(getImageForProductCategory(null)).toBe(PRODUCT_IMAGES.default);
      expect(getImageForProductCategory(undefined)).toBe(
        PRODUCT_IMAGES.default,
      );
    });
  });
});
