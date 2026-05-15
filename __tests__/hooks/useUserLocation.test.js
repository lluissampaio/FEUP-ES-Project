import { useUserLocation } from "@/hooks/useUserLocation";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";

jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

describe("Unit Test: Hook useUserLocation", () => {
  const mockGPSCoords = {
    latitude: 41.1579,
    longitude: -8.6291,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Silenciar os warnings previstos nos testes para manter a consola limpa
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Deve retornar a localização se a permissão já estiver concedida", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    Location.getLastKnownPositionAsync.mockResolvedValue({
      coords: mockGPSCoords,
    });

    const { result } = renderHook(() => useUserLocation());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual(mockGPSCoords);
    expect(result.current.error).toBeNull();
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it("Deve solicitar permissão se ainda não estiver concedida e obter a localização", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "undetermined",
    });
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    Location.getLastKnownPositionAsync.mockResolvedValue({
      coords: mockGPSCoords,
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(result.current.location).toEqual(mockGPSCoords);
  });

  it("Deve definir o erro se a permissão for negada", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "denied",
    });
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Permissão negada");
  });

  it("Deve usar getCurrentPositionAsync se getLastKnownPositionAsync for nulo", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    Location.getLastKnownPositionAsync.mockResolvedValue(null);
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: mockGPSCoords,
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
      accuracy: Location.Accuracy.Balanced,
    });
    expect(result.current.location).toEqual(mockGPSCoords);
  });

  it("Deve apresentar erro de timeout se o getCurrentPositionAsync demorar mais de 5 segundos", async () => {
    jest.useFakeTimers();

    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    Location.getLastKnownPositionAsync.mockResolvedValue(null);
    // GPS que nunca resolve
    Location.getCurrentPositionAsync.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useUserLocation());

    // Utilizar advanceTimersByTimeAsync garante que as promises e microtasks
    // pendentes correm em conformidade com o relógio interno do Jest
    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Timeout: Erro no GPS");

    jest.useRealTimers();
  });

  it("Deve lidar com erros genéricos do GPS (serviço desativado...)", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    Location.getLastKnownPositionAsync.mockRejectedValue(
      new Error("Location services disabled"),
    );

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Location services disabled");
  });

  it("Deve refazer a busca de localização ao chamar refreshLocation", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    Location.getLastKnownPositionAsync.mockResolvedValue({
      coords: mockGPSCoords,
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Location.getLastKnownPositionAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refreshLocation();
    });

    expect(Location.getLastKnownPositionAsync).toHaveBeenCalledTimes(2);
    expect(result.current.location).toEqual(mockGPSCoords);
  });
});
