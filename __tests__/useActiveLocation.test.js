import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useActiveLocation } from "@/hooks/useActiveLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock useUserLocation
const mockRefreshLocation = jest.fn();
jest.mock("@/hooks/useUserLocation", () => ({
  useUserLocation: jest.fn(),
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Import the mocked module so we can control its implementation in tests
const { useUserLocation } = require("@/hooks/useUserLocation");

describe("Unit Test: Hook useActiveLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for useUserLocation
    useUserLocation.mockReturnValue({
      location: null,
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    // Default mock for AsyncStorage.getItem (no override stored)
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it("Deve iniciar sem localização e sem override", async () => {
    const { result } = renderHook(() => useActiveLocation());

    // Initial state before AsyncStorage resolves
    expect(result.current.isLoading).toBe(true);
    expect(result.current.override).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.override).toBeNull();
  });

  it("Deve usar a localização GPS quando não há override", async () => {
    useUserLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    const { result } = renderHook(() => useActiveLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual({
      latitude: 41.15,
      longitude: -8.61,
    });
    expect(result.current.override).toBeNull();
  });

  it("Deve carregar o override do AsyncStorage na inicialização", async () => {
    const storedOverride = JSON.stringify({
      type: "manual",
      lat: 38.72,
      lon: -9.13,
      name: "Lisboa, Portugal",
    });

    AsyncStorage.getItem.mockResolvedValue(storedOverride);

    const { result } = renderHook(() => useActiveLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Location should be derived from the override, not GPS
    expect(result.current.location).toEqual({
      latitude: 38.72,
      longitude: -9.13,
    });
    expect(result.current.override).toEqual(JSON.parse(storedOverride));
  });

  it("Deve priorizar o override em vez do GPS", async () => {
    const storedOverride = JSON.stringify({
      type: "manual",
      lat: 38.72,
      lon: -9.13,
      name: "Lisboa, Portugal",
    });

    AsyncStorage.getItem.mockResolvedValue(storedOverride);

    // GPS is also active and returning Porto
    useUserLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    const { result } = renderHook(() => useActiveLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should ignore GPS and use Override
    expect(result.current.location).toEqual({
      latitude: 38.72,
      longitude: -9.13,
    });
  });

  it("Deve definir uma localização manual e guardar no AsyncStorage", async () => {
    const { result } = renderHook(() => useActiveLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newLocation = {
      latitude: 37.01,
      longitude: -7.93,
      displayString: "Faro, Portugal",
    };

    await act(async () => {
      await result.current.setManualLocation(newLocation);
    });

    // Check if AsyncStorage.setItem was called correctly
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@location_override",
      JSON.stringify({
        type: "manual",
        lat: 37.01,
        lon: -7.93,
        name: "Faro, Portugal",
      })
    );

    // Check if the state updated correctly
    expect(result.current.location).toEqual({
      latitude: 37.01,
      longitude: -7.93,
    });
    expect(result.current.override).toEqual({
      type: "manual",
      lat: 37.01,
      lon: -7.93,
      name: "Faro, Portugal",
    });
  });

  it("Deve limpar o override e reverter para o GPS", async () => {
    // Start with an override
    const storedOverride = JSON.stringify({
      type: "manual",
      lat: 38.72,
      lon: -9.13,
      name: "Lisboa, Portugal",
    });
    AsyncStorage.getItem.mockResolvedValue(storedOverride);

    // GPS is active
    useUserLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    const { result } = renderHook(() => useActiveLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify it starts on override
    expect(result.current.location).toEqual({
      latitude: 38.72,
      longitude: -9.13,
    });

    // Clear the override
    await act(async () => {
      await result.current.clearOverride();
    });

    // Should remove from storage
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@location_override");

    // Should revert to GPS
    expect(result.current.location).toEqual({
      latitude: 41.15,
      longitude: -8.61,
    });
    expect(result.current.override).toBeNull();
  });

  it("Deve combinar os estados de loading do GPS e do AsyncStorage", async () => {
    useUserLocation.mockReturnValue({
      location: null,
      isLoading: true, // GPS is still loading
      refreshLocation: mockRefreshLocation,
    });

    // AsyncStorage hasn't resolved yet
    let resolveStorage;
    AsyncStorage.getItem.mockReturnValue(
      new Promise((resolve) => {
        resolveStorage = resolve;
      })
    );

    const { result } = renderHook(() => useActiveLocation());

    // Both are loading
    expect(result.current.isLoading).toBe(true);

    // Resolve AsyncStorage
    await act(async () => {
      resolveStorage(null);
    });

    // Storage is done, but GPS is still loading
    expect(result.current.isLoading).toBe(true);

    // Simulate GPS finishing loading
    useUserLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    // Re-render to pick up the mock change (renderHook handles this automatically on next interaction)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("Deve expor a função refreshLocation do useUserLocation", async () => {
    const { result } = renderHook(() => useActiveLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.refreshLocation();
    });

    expect(mockRefreshLocation).toHaveBeenCalledTimes(1);
  });
});