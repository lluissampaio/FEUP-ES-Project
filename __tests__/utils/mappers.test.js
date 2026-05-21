import { mapDocToProduct } from "@/utils/mappers";

describe("Unit Test: Utils - mapDocToProduct", () => {
  const mockDocSnap = (id, data) => ({
    id,
    data: () => data,
  });

  it("Deve mapear um produto base sem preços corretamente", () => {
    const doc = mockDocSnap("prod_1", {
      name: "Maçã",
      category: "frutas_vegetais",
      capacity: 1,
      measurement_unit: "kg",
      image_ref: "maca_fuji",
      prices: {},
    });

    const result = mapDocToProduct(doc);

    expect(result.id).toBe("prod_1");
    expect(result.name).toBe("Maçã");
    expect(result.formattedCapacity).toBe("1 kg");
    expect(result.currentPrice).toBe(0);
    expect(result.bestStore).toBe("");
    expect(result.isPromo).toBe(false);
  });

  it("Deve identificar a loja mais barata e mapear promoções", () => {
    const doc = mockDocSnap("prod_2", {
      name: "Leite",
      capacity: 1,
      measurement_unit: "L",
      prices: {
        continente: {
          current_price: 0.95,
          is_promo: false,
          original_price: null,
        },
        pingo_doce: {
          current_price: 0.85,
          is_promo: true,
          original_price: 1.05,
        },
        auchan: {
          current_price: 0.9,
          is_promo: false,
          original_price: null,
        },
      },
    });

    const result = mapDocToProduct(doc);

    expect(result.bestStore).toBe("pingo_doce");
    expect(result.currentPrice).toBe(0.85);
    expect(result.isPromo).toBe(true);
    expect(result.originalPrice).toBe(1.05);
  });

  it("Deve ignorar original_price se is_promo for falso", () => {
    const doc = mockDocSnap("prod_3", {
      name: "Pão",
      capacity: 500,
      measurement_unit: "g",
      prices: {
        lidl: {
          current_price: 1.2,
          is_promo: false,
          original_price: 1.5,
        },
      },
    });

    const result = mapDocToProduct(doc);

    expect(result.bestStore).toBe("lidl");
    expect(result.currentPrice).toBe(1.2);
    expect(result.isPromo).toBe(false);
    expect(result.originalPrice).toBeNull();
  });
});
