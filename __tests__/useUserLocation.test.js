import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useUserLocation } from "@/hooks/useUserLocation";
import * as Location from "expo-location";

// Mock expo-location
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
    // Do not use fake timers by default to avoid interfering with renderHook's async utils
  });

  it("Deve retornar a localização se a permissão já estiver concedida", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getLastKnownPositionAsync.mockResolvedValue({ coords: mockGPSCoords });

    const { result } = renderHook(() => useUserLocation());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual(mockGPSCoords);
    expect(result.current.error).toBeNull();
    // Should NOT request permissions if already granted
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it("Deve solicitar permissão se ainda não estiver concedida e obter a localização", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "undetermined" });
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getLastKnownPositionAsync.mockResolvedValue({ coords: mockGPSCoords });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(result.current.location).toEqual(mockGPSCoords);
  });

  it("Deve definir o erro se a permissão for negada", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "denied" });
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "denied" });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Permissão negada");
  });

  it("Deve usar getCurrentPositionAsync se getLastKnownPositionAsync for nulo", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getLastKnownPositionAsync.mockResolvedValue(null);
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: mockGPSCoords });

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

    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getLastKnownPositionAsync.mockResolvedValue(null);
    
    // Simulate a hanging GPS request that never resolves naturally
    Location.getCurrentPositionAsync.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useUserLocation());

    // Initial loading state
    expect(result.current.isLoading).toBe(true);

    // Advance time by 5 seconds to trigger the timeout
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    // Wait for the state to update after the timeout rejects the promise
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Timeout: Erro no GPS");

    jest.useRealTimers();
  });

  it("Deve lidar com erros genéricos do GPS (serviço desativado...)", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getLastKnownPositionAsync.mockRejectedValue(new Error("Location services disabled"));

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Location services disabled");
  });

  it("Deve refazer a busca de localização ao chamar refreshLocation", async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getLastKnownPositionAsync.mockResolvedValue({ coords: mockGPSCoords });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Initial fetch
    expect(Location.getLastKnownPositionAsync).toHaveBeenCalledTimes(1);

    // Trigger refresh
    await act(async () => {
      await result.current.refreshLocation();
    });

    // Should have fetched again
    expect(Location.getLastKnownPositionAsync).toHaveBeenCalledTimes(2);
    expect(result.current.location).toEqual(mockGPSCoords);
  });
});