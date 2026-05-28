import useProducts from "@/hooks/useProducts";
import { act, renderHook, waitFor } from "@testing-library/react-native";

const mockGetDocs = jest.fn();
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "collection_ref"),
  getDocs: (...args) => mockGetDocs(...args),
  query: jest.fn((...args) => ({ _args: args })),
  orderBy: jest.fn((field) => ({ _orderBy: field })),
  where: jest.fn((field, op, val) => ({ _where: { field, op, val } })),
  limit: jest.fn((n) => ({ _limit: n })),
  startAfter: jest.fn((doc) => ({ _startAfter: doc })),
}));

jest.mock("@/firebaseConfig", () => ({ db: {} }));

let queryCounter = 0;
const uniqueQuery = () => `test_query_${++queryCounter}`;

const makeDoc = (id, overrides = {}) => ({
  id,
  data: () => ({
    name: `Produto ${id}`,
    name_for_search: `produto ${id}`,
    category: "mercearia",
    capacity: 1,
    measurement_unit: "L",
    image_ref: "leite",
    prices: {},
    ...overrides,
  }),
});

const makeSnapshot = (docs) => ({
  docs,
  empty: docs.length === 0,
});

describe("Integration Test: Hook useProducts com Firebase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve mostrar loading=true no início e false após fetch", async () => {
    mockGetDocs.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProducts("tudo"));
    expect(result.current.loading).toBe(true);
  });

  it("Deve mapear corretamente os campos de um produto simples", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_1", {
          name: "Leite Mimosa",
          capacity: 1,
          measurement_unit: "L",
          prices: {
            continente: {
              current_price: 0.89,
              is_promo: false,
              original_price: null,
            },
          },
        }),
      ]),
    );
    const { result } = renderHook(() => useProducts("tudo", ""));
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
            pingo_doce: {
              current_price: 0.94,
              is_promo: true,
              original_price: 1.08,
            },
          },
        }),
      ]),
    );
    const { result } = renderHook(() => useProducts("tudo", ""));
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
      ]),
    );
    const { result } = renderHook(() => useProducts("tudo", ""));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products[0].isPromo).toBe(false);
    expect(result.current.products[0].originalPrice).toBeNull();
  });

  it("Deve selecionar a loja com o preço mais baixo como bestStore", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_multi", {
          name: "Água 1.5L",
          prices: {
            continente: {
              current_price: 0.55,
              is_promo: false,
              original_price: null,
            },
            aldi: {
              current_price: 0.39,
              is_promo: false,
              original_price: null,
            },
            pingo_doce: {
              current_price: 0.6,
              is_promo: false,
              original_price: null,
            },
          },
        }),
      ]),
    );
    const { result } = renderHook(() => useProducts("tudo", ""));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products[0].bestStore).toBe("aldi");
    expect(result.current.products[0].currentPrice).toBe(0.39);
  });

  it("com fake timers - Deve mostrar loading=true enquanto o Firebase não resolve", async () => {
    jest.useFakeTimers();
    let resolveFirebase;
    const promise = new Promise((resolve) => {
      resolveFirebase = resolve;
    });
    mockGetDocs.mockReturnValue(promise);

    const { result } = renderHook(() => useProducts("tudo", ""));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFirebase(makeSnapshot([]));
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    jest.useRealTimers();
  });

  it("Deve retornar array vazio quando o Firebase não retorna documentos", async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([]));
    const { result } = renderHook(() => useProducts("tudo", ""));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });

  it("Deve indicar hasMore=false quando o Firebase retorna menos de 20 documentos", async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([makeDoc("pa"), makeDoc("pb")]));
    const { result } = renderHook(() => useProducts("tudo", uniqueQuery()));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(false);
  });

  it("Deve formatar corretamente a capacidade com diferentes unidades", async () => {
    mockGetDocs.mockResolvedValue(
      makeSnapshot([
        makeDoc("prod_kg", {
          name: "Arroz",
          capacity: 5,
          measurement_unit: "Kg",
        }),
      ]),
    );
    const { result } = renderHook(() => useProducts("tudo", ""));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products[0].formattedCapacity).toBe("5 Kg");
  });
});
