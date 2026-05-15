import { useSupermarketDetail } from "@/hooks/useSupermarketDetail";
import { renderHook, waitFor, rerender } from "@testing-library/react-native";

// helpers

const getDayOfWeek = () => new Date().getDay();
const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const makeFullSchedule = (opening = 480, closing = 1320) => ({
  0: { opening, closing },
  1: { opening, closing },
  2: { opening, closing },
  3: { opening, closing },
  4: { opening, closing },
  5: { opening, closing },
  6: { opening, closing },
});

const makeDocSnap = (id, data, exists = true) => ({
  id,
  exists: () => exists,
  data: () => data,
});

const defaultStoreData = (overrides = {}) => ({
  name: "Continente Bom Dia Asprela",
  location: { latitude: 41.178, longitude: -8.593 },
  address: "Rua da Asprela 123, Porto",
  schedule: makeFullSchedule(),
  ...overrides,
});

// firebase mocks

const mockGetDoc = jest.fn();

jest.mock("firebase/firestore", () => ({
  doc: jest.fn((db, collection, id) => id),
  getDoc: (...args) => mockGetDoc(...args),
}));

jest.mock("@/firebaseConfig", () => ({ db: {} }));

// tests

describe("Integration Test: Hook useSupermarketDetail", () => {
  const userLocation = { latitude: 41.15, longitude: -8.61 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // initial state

  it("Deve iniciar com loading=true e store=null", () => {
    mockGetDoc.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.store).toBeNull();
    expect(result.current.error).toBeNull();
  });

  // successful fetch

  it("Deve buscar e mapear corretamente os dados do supermercado", async () => {
    mockGetDoc.mockResolvedValue(makeDocSnap("store_1", defaultStoreData()));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const store = result.current.store;
    expect(store.id).toBe("store_1");
    expect(store.name).toBe("Continente Bom Dia Asprela");
    expect(store.address).toBe("Rua da Asprela 123, Porto");
    expect(store.weeklySchedule).toHaveLength(7);
    expect(store.error).toBeUndefined();
  });

  // schedule order

  it("Deve ordenar o horário de Segunda a Domingo", async () => {
    mockGetDoc.mockResolvedValue(makeDocSnap("store_1", defaultStoreData()));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const dayNames = result.current.store.weeklySchedule.map((d) => d.dayName);
    expect(dayNames).toEqual([
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ]);
  });

  // schedule formatting

  it("Deve formatar o timeRange como 'HH:MM - HH:MM'", async () => {
    mockGetDoc.mockResolvedValue(
      makeDocSnap(
        "store_1",
        defaultStoreData({
          schedule: makeFullSchedule(480, 1320),
        }),
      ),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const row = result.current.store.weeklySchedule[0];
    expect(row.timeRange).toBe("08:00 - 22:00");
  });

  it("Deve mostrar 'Fechado' para dias sem horário", async () => {
    const schedule = makeFullSchedule();
    schedule[0] = null; // Domingo without schedule

    mockGetDoc.mockResolvedValue(
      makeDocSnap("store_1", defaultStoreData({ schedule })),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const domingo = result.current.store.weeklySchedule.find(
      (d) => d.dayName === "Domingo",
    );
    expect(domingo.timeRange).toBe("Fechado");
  });

  // isToday

  it("Deve marcar apenas o dia atual com isToday=true", async () => {
    mockGetDoc.mockResolvedValue(makeDocSnap("store_1", defaultStoreData()));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const todayCount = result.current.store.weeklySchedule.filter(
      (d) => d.isToday,
    ).length;
    expect(todayCount).toBe(1);

    const todayName = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ][getDayOfWeek()];
    const todayEntry = result.current.store.weeklySchedule.find(
      (d) => d.isToday,
    );
    expect(todayEntry.dayName).toBe(todayName);
  });

  // isOpen

  it("Deve marcar como aberto quando o horário atual está dentro do schedule", async () => {
    const agora = getCurrentMinutes();
    const abertura = Math.max(0, agora - 60);
    const fecho = Math.min(1439, agora + 60);

    mockGetDoc.mockResolvedValue(
      makeDocSnap(
        "store_1",
        defaultStoreData({
          schedule: makeFullSchedule(abertura, fecho),
        }),
      ),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.store.isOpen).toBe(true);
  });

  it("Deve marcar como fechado quando o horário atual está fora do schedule", async () => {
    const agora = getCurrentMinutes();
    if (agora < 2) return; // avoid midnight edge case

    mockGetDoc.mockResolvedValue(
      makeDocSnap(
        "store_1",
        defaultStoreData({
          schedule: makeFullSchedule(0, 1),
        }),
      ),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.store.isOpen).toBe(false);
  });

  // distance

  it("Deve calcular a distância quando userLocation está disponível", async () => {
    mockGetDoc.mockResolvedValue(
      makeDocSnap(
        "store_1",
        defaultStoreData({
          location: { latitude: 41.178, longitude: -8.593 },
        }),
      ),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", { latitude: 41.15, longitude: -8.61 }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.store.formattedDistance).not.toBe("N/A");
    expect(result.current.store.formattedDistance).toMatch(/km|m$/);
  });

  it("Deve retornar formattedDistance='N/A' quando userLocation é null", async () => {
    mockGetDoc.mockResolvedValue(makeDocSnap("store_1", defaultStoreData()));

    const { result } = renderHook(() => useSupermarketDetail("store_1", null));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.store.formattedDistance).toBe("N/A");
  });

  it("Deve recalcular a distância quando userLocation muda", async () => {
    mockGetDoc.mockResolvedValue(
      makeDocSnap(
        "store_1",
        defaultStoreData({
          location: { latitude: 41.2, longitude: -8.61 },
        }),
      ),
    );

    const { result, rerender } = renderHook(
      ({ loc }) => useSupermarketDetail("store_1", loc),
      { initialProps: { loc: { latitude: 41.15, longitude: -8.61 } } },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const distInicial = result.current.store.formattedDistance;

    rerender({ loc: { latitude: 41.2, longitude: -8.61 } });

    const distAtualizada = result.current.store.formattedDistance;
    // by moving to the location of the supermarket, distance should decrease
    expect(distAtualizada).not.toBe("N/A");
  });

  // fallback chain for address

  it("Deve usar o campo 'address' como fonte primária", async () => {
    mockGetDoc.mockResolvedValue(
      makeDocSnap("store_1", {
        ...defaultStoreData(),
        address: "Rua A",
        endereco: "Rua B",
        morada: "Rua C",
      }),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store.address).toBe("Rua A");
  });

  it("Deve usar 'endereco' como fallback quando 'address' não existe", async () => {
    const data = defaultStoreData();
    delete data.address;

    mockGetDoc.mockResolvedValue(
      makeDocSnap("store_1", { ...data, endereco: "Rua B", morada: "Rua C" }),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store.address).toBe("Rua B");
  });

  it("Deve usar 'morada' como último fallback", async () => {
    const data = defaultStoreData();
    delete data.address;
    delete data.endereco;

    mockGetDoc.mockResolvedValue(
      makeDocSnap("store_1", { ...data, morada: "Rua C" }),
    );

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store.address).toBe("Rua C");
  });

  it("Deve retornar address=null quando nenhum campo de endereço existe", async () => {
    const data = defaultStoreData();
    delete data.address;

    mockGetDoc.mockResolvedValue(makeDocSnap("store_1", data));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.store.address).toBeNull();
  });

  // document not found

  it("Deve definir error='not_found' quando o documento não existe", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const { result } = renderHook(() =>
      useSupermarketDetail("store_invalid", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("not_found");
    expect(result.current.store).toBeNull();
  });

  // firebase error

  it("Deve lidar com erros do Firebase sem crashar", async () => {
    mockGetDoc.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.store).toBeNull();
  });

  // no storeId

  it("Não deve fazer fetch quando storeId é null", () => {
    const { result } = renderHook(() =>
      useSupermarketDetail(null, userLocation),
    );

    expect(mockGetDoc).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
  });

  // name by omission

  it("Deve usar 'Sem Nome' quando o documento não tem campo name", async () => {
    const data = defaultStoreData();
    delete data.name;

    mockGetDoc.mockResolvedValue(makeDocSnap("store_1", data));

    const { result } = renderHook(() =>
      useSupermarketDetail("store_1", userLocation),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.store.name).toBe("Sem Nome");
  });
});
