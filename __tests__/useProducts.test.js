import useProducts from "@/hooks/useProducts";
import { act, renderHook, waitFor } from "@testing-library/react-native";

// Mock Firebase

const mockGetDocs = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "collection_ref"),
  getDocs: (...args) => mockGetDocs(...args),
  query: jest.fn((...args) => ({ _args: args })),
  orderBy: jest.fn((field) => ({ _orderBy: field })),
  where: jest.fn((field, op, val) => ({ _where: { field, op, val } })),
  limit: jest.fn((n) => ({ _limit: n })),
  startAt: jest.fn((doc) => ({ _startAt: doc })),
}));

jest.mock("@/firebaseConfig", () => ({ db: {} }));

// Helpers

let queryCounter = 0;
/** Devolve uma query única por teste para nunca bater no cache. */
const uniqueQuery = () => `test_query_${++queryCounter}`;

const makeDoc = (id, overrides = {}) => ({
  id,
  data: () => ({
    name: `Produto ${id}`,
    name_for_search: `produto ${id}`,
    capacity: 1,
    measurement_unit: "un",
    image_ref: "mercearia",
    prices: {
      continente: { current_price: 1.0, is_promo: false, original_price: null },
    },
    ...overrides,
  }),
});

const makeSnapshot = (docs) => ({ docs });

// Testes

describe("Unit Test: Hook useProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Estado inicial

  it("Deve arrancar com produtos vazios e loading=false para query vazia", async () => {
    const { result } = renderHook(() => useProducts(""));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  // Mapeamento de dados

  it("Deve mapear corretamente os campos de um produto simples", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_1", {
          name: "Leite Mimosa",
          capacity: 1,
          measurement_unit: "L",
          prices: {
            continente: { current_price: 0.89, is_promo: false, original_price: null },
          },
        }),
      ])
    );

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const produto = result.current.products[0];
    expect(produto.name).toBe("Leite Mimosa");
    expect(produto.formattedCapacity).toBe("1 L");
    expect(produto.currentPrice).toBe(0.89);
    expect(produto.isPromo).toBe(false);
    expect(produto.originalPrice).toBeNull();
    expect(produto.bestStore).toBe("continente");
  });

  it("Deve mapear corretamente um produto em promoção com preço original", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_promo", {
          name: "Açúcar Branco",
          prices: {
            pingo_doce: { current_price: 0.94, is_promo: true, original_price: 1.08 },
          },
        }),
      ])
    );

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const produto = result.current.products[0];
    expect(produto.isPromo).toBe(true);
    expect(produto.currentPrice).toBe(0.94);
    expect(produto.originalPrice).toBe(1.08);
  });

  it("Não deve marcar como promo se is_promo=true mas original_price for nulo", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_edge", {
          prices: {
            lidl: { current_price: 0.5, is_promo: true, original_price: null },
          },
        }),
      ])
    );

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products[0].isPromo).toBe(false);
    expect(result.current.products[0].originalPrice).toBeNull();
  });

  // Melhor preço (bestStore)

  it("Deve selecionar a loja com o preço mais baixo como bestStore", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_multi", {
          name: "Água 1.5L",
          prices: {
            continente: { current_price: 0.55, is_promo: false, original_price: null },
            aldi:       { current_price: 0.39, is_promo: false, original_price: null },
            pingo_doce: { current_price: 0.60, is_promo: false, original_price: null },
          },
        }),
      ])
    );

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products[0].bestStore).toBe("aldi");
    expect(result.current.products[0].currentPrice).toBe(0.39);
  });

  // Loading state
  // O hook usa useDebounce(2000ms): a query só é normalizada e o fetch só
  // arranca depois de 2000ms. Usamos fake timers para controlar isso.

  describe("com fake timers", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("Deve mostrar loading=true enquanto o Firebase não resolve", async () => {
      let resolveDocs;
      mockGetDocs.mockReturnValue(
        new Promise((resolve) => { resolveDocs = resolve; })
      );

      const { result } = renderHook(() => useProducts(uniqueQuery()));

      // Avançar o debounce para disparar o fetch
      await act(async () => {
        jest.advanceTimersByTime(2000);
        await Promise.resolve();
      });

      // Fetch em curso → loading deve ser true
      expect(result.current.loading).toBe(true);

      // Resolver para não deixar promises pendentes
      await act(async () => {
        resolveDocs(makeSnapshot([]));
        await Promise.resolve();
      });

      await waitFor(() => expect(result.current.loading).toBe(false));
    });
  });

  // Resultado vazio

  it("Deve retornar array vazio quando o Firebase não retorna documentos", async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([]));

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });

  // Paginação

  it("Deve indicar hasMore=true quando o Firebase retorna 20 documentos", async () => {
    const vinte = Array.from({ length: 20 }, (_, i) => makeDoc(`p20_${i}`));
    mockGetDocs.mockResolvedValue(makeSnapshot(vinte));

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(true);
  });

  it("Deve indicar hasMore=false quando o Firebase retorna menos de 20 documentos", async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([makeDoc("pa"), makeDoc("pb")]));

    // Query única → cache limpo, sem contaminação do teste anterior
    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(false);
  });

  // Erro do Firebase

  it("Deve manter loading=false e products=[] em caso de erro do Firebase", async () => {
    mockGetDocs.mockRejectedValue(new Error("Firestore unavailable"));

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
  });

  // formattedCapacity

  it("Deve formatar corretamente a capacidade com diferentes unidades", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_kg", { name: "Arroz", capacity: 5, measurement_unit: "Kg" }),
      ])
    );

    const { result } = renderHook(() => useProducts(uniqueQuery()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products[0].formattedCapacity).toBe("5 Kg");
  });
});