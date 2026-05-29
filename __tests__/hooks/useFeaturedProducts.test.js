import useFeaturedProducts from "@/hooks/useFeaturedProducts";
import { renderHook, waitFor } from "@testing-library/react-native";

const mockGetDocs = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: (...args) => mockGetDocs(...args),
  query: jest.fn(),
  limit: jest.fn(),
}));

jest.mock("@/firebaseConfig", () => ({ db: {} }));

const makeDocSnap = (id, data) => ({
  id,
  data: () => data,
});

describe("Integration Test: Hook useFeaturedProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Cenário 1: Estado inicial deve ser loading=true e array vazio", () => {
    mockGetDocs.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFeaturedProducts());

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
  });

  it("Cenário 2: Calcula o bestStore e o preço mais baixo corretamente", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeDocSnap("prod_1", {
          name: "Arroz Agulha",
          capacity: 1,
          measurement_unit: "kg",
          image_ref: "mercearia",
          prices: {
            pingo_doce: {
              current_price: 1.2,
              is_promo: false,
              original_price: null,
            },
            continente: {
              current_price: 1.1,
              is_promo: false,
              original_price: null,
            },
            auchan: {
              current_price: 1.15,
              is_promo: false,
              original_price: null,
            },
          },
        }),
      ],
    });

    const { result } = renderHook(() => useFeaturedProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const product = result.current.products[0];
    expect(product.bestStore).toBe("continente");
    expect(product.currentPrice).toBe(1.1);
    expect(product.isPromo).toBe(false);
    expect(product.formattedCapacity).toBe("1 kg");
  });

  it("Cenário 3: Processa promoções estritamente se existirem na loja vencedora", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeDocSnap("prod_2", {
          name: "Azeite",
          capacity: 750,
          measurement_unit: "ml",
          prices: {
            mercadona: {
              current_price: 6.0,
              is_promo: false,
              original_price: null,
            },
            minipreco: {
              current_price: 5.5,
              is_promo: true,
              original_price: 8.0,
            },
          },
        }),
      ],
    });

    const { result } = renderHook(() => useFeaturedProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const product = result.current.products[0];
    expect(product.bestStore).toBe("minipreco");
    expect(product.currentPrice).toBe(5.5);
    expect(product.originalPrice).toBe(8.0);
    expect(product.isPromo).toBe(true);
  });

  it("Cenário 4: Sobrevive a produtos sem preços registados (Prevenção de TypeError)", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeDocSnap("prod_3", {
          name: "Produto Fantasma",
          capacity: 100,
          measurement_unit: "g",
          prices: {},
        }),
        makeDocSnap("prod_4", {
          name: "Produto Sem Propriedade",
          capacity: 200,
          measurement_unit: "g",
        }),
      ],
    });

    const { result } = renderHook(() => useFeaturedProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toHaveLength(2);

    expect(result.current.products[0].currentPrice).toBe(0);
    expect(result.current.products[0].bestStore).toBe("");
    expect(result.current.products[1].currentPrice).toBe(0);
  });

  it("Cenário 5: Captura e neutraliza erros do Firebase mantendo estabilidade", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockGetDocs.mockRejectedValue(new Error("Falha na Rede Firestore"));

    const { result } = renderHook(() => useFeaturedProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Erro ao buscar produtos:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
