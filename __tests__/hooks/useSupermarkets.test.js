import { useSupermarkets } from "@/hooks/useSupermarkets";
import { renderHook, waitFor } from "@testing-library/react-native";

// Helpers

const getDayOfWeek = () => new Date().getDay();
const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const makeStore = (id, name, coords, scheduleOverride = null) => {
  const dayOfWeek = getDayOfWeek();

  // Por omissão: loja que abre às 0h e fecha às 23h59 (sempre aberta)
  const defaultSchedule = {
    [dayOfWeek]: { opening: 0, closing: 1439 },
  };

  return {
    id,
    data: () => ({
      name,
      location: coords,
      schedule: scheduleOverride ?? defaultSchedule,
    }),
  };
};

//  Mocks Firebase

const mockGetDocs = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: (...args) => mockGetDocs(...args),
}));

jest.mock("@/firebaseConfig", () => ({ db: {} }));

//  Testes

describe("Unit Test: Hook useSupermarkets (extended)", () => {
  const userLocation = { latitude: 41.15, longitude: -8.61 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  Estado de loading

  it("Deve iniciar com loading=true e supermercados vazios", () => {
    mockGetDocs.mockReturnValue(new Promise(() => {})); // pending forever

    const { result } = renderHook(() => useSupermarkets(userLocation));

    expect(result.current.loading).toBe(true);
    expect(result.current.supermarkets).toHaveLength(0);
  });

  //  Cálculo de distância

  it("Deve calcular e formatar a distância corretamente", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeStore("s1", "Continente", { latitude: 41.16, longitude: -8.61 }),
      ],
    });

    const { result } = renderHook(() =>
      useSupermarkets({ latitude: 41.15, longitude: -8.61 }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const loja = result.current.supermarkets[0];
    expect(loja.formattedDistance).toMatch(/km$/);
    expect(typeof loja.rawDistance).toBe("number");
    expect(loja.rawDistance).toBeGreaterThan(0);
    expect(loja.rawDistance).toBeLessThan(5); // ~1.1 km
  });

  it("Deve retornar formattedDistance='N/A' e rawDistance=null quando userLocation é null", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [makeStore("s1", "Aldi", { latitude: 41.16, longitude: -8.62 })],
    });

    const { result } = renderHook(() => useSupermarkets(null));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets[0].formattedDistance).toBe("N/A");
    expect(result.current.supermarkets[0].rawDistance).toBeNull();
  });

  it("Deve recalcular a distância quando userLocation muda", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeStore("s1", "Mercadona", { latitude: 41.2, longitude: -8.61 }),
      ],
    });

    const { result, rerender } = renderHook(({ loc }) => useSupermarkets(loc), {
      initialProps: { loc: { latitude: 41.15, longitude: -8.61 } },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const distanciaInicial = result.current.supermarkets[0].rawDistance;

    // Mover o utilizador para perto da loja
    rerender({ loc: { latitude: 41.2, longitude: -8.61 } });

    const distanciaAtualizada = result.current.supermarkets[0].rawDistance;

    expect(distanciaAtualizada).toBeLessThan(distanciaInicial);
  });

  //  Estado aberto/fechado

  it("Deve marcar loja como aberta quando o horário atual está dentro do schedule", async () => {
    const agora = getCurrentMinutes();
    const abertura = Math.max(0, agora - 60); // 1h antes
    const fecho = Math.min(1439, agora + 60); // 1h depois

    mockGetDocs.mockResolvedValue({
      docs: [
        makeStore(
          "s1",
          "Loja Aberta",
          { latitude: 41.15, longitude: -8.6 },
          {
            [getDayOfWeek()]: { opening: abertura, closing: fecho },
          },
        ),
      ],
    });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets[0].isOpen).toBe(true);
  });

  it("Deve marcar loja como fechada quando o horário atual está fora do schedule", async () => {
    // Horário completamente no passado: abre às 0h e fechou às 1h
    // (só funciona se não forem exactamente 0h-1h no momento do teste)
    const agora = getCurrentMinutes();
    if (agora < 2) {
      // Evitar falso negativo nos primeiros minutos do dia
      return;
    }

    mockGetDocs.mockResolvedValue({
      docs: [
        makeStore(
          "s1",
          "Loja Fechada",
          { latitude: 41.15, longitude: -8.6 },
          {
            [getDayOfWeek()]: { opening: 0, closing: 1 }, // Fechou à 00h01
          },
        ),
      ],
    });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets[0].isOpen).toBe(false);
  });

  it("Deve usar 'Indisponível' como scheduleToday quando não há schedule", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: "s1",
          data: () => ({
            name: "Loja Sem Horário",
            location: { latitude: 41.15, longitude: -8.6 },
            schedule: null,
          }),
        },
      ],
    });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets[0].scheduleToday).toBe("Indisponível");
    expect(result.current.supermarkets[0].isOpen).toBe(false);
  });

  // Formatação de scheduleToday

  it("Deve formatar scheduleToday corretamente (ex: 8h-22h)", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeStore(
          "s1",
          "Loja Com Horário",
          { latitude: 41.15, longitude: -8.6 },
          {
            [getDayOfWeek()]: { opening: 480, closing: 1320 }, // 8h - 22h
          },
        ),
      ],
    });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets[0].scheduleToday).toBe("8h-22h");
  });

  // Nome por omissão

  it("Deve usar 'Sem Nome' quando o documento não tem campo name", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: "s_sem_nome",
          data: () => ({
            location: { latitude: 41.15, longitude: -8.61 },
            schedule: {},
          }),
        },
      ],
    });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets[0].name).toBe("Sem Nome");
  });

  // Múltiplas lojas

  it("Deve mapear corretamente múltiplas lojas com diferentes distâncias", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        makeStore("s1", "Continente", { latitude: 41.16, longitude: -8.61 }),
        makeStore("s2", "Pingo Doce", { latitude: 41.2, longitude: -8.65 }),
        makeStore("s3", "Mercadona", { latitude: 41.14, longitude: -8.6 }),
      ],
    });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets).toHaveLength(3);

    const nomes = result.current.supermarkets.map((s) => s.name);
    expect(nomes).toContain("Continente");
    expect(nomes).toContain("Pingo Doce");
    expect(nomes).toContain("Mercadona");

    // Todas têm distância calculada
    result.current.supermarkets.forEach((s) => {
      expect(typeof s.rawDistance).toBe("number");
    });
  });

  // Erro do Firebase

  it("Deve lidar com erro do Firebase sem crashar e ter loading=false", async () => {
    mockGetDocs.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets).toHaveLength(0);
  });

  // Firebase vazio

  it("Deve retornar lista vazia quando não há lojas na BD", async () => {
    mockGetDocs.mockResolvedValue({ docs: [] });

    const { result } = renderHook(() => useSupermarkets(userLocation));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.supermarkets).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });
});
