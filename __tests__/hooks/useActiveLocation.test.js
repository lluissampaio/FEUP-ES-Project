import { useActiveLocation } from "@/hooks/useActiveLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

const mockRefreshLocation = jest.fn();
jest.mock("@/hooks/useUserLocation", () => ({
  useUserLocation: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const { useUserLocation } = require("@/hooks/useUserLocation");

describe("Unit Test: Hook useActiveLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserLocation.mockReturnValue({
      location: null,
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it("Deve iniciar sem localização e sem override", async () => {
    const { result } = renderHook(() => useActiveLocation());

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

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@location_override",
      JSON.stringify({
        type: "manual",
        lat: 37.01,
        lon: -7.93,
        name: "Faro, Portugal",
      })
    );

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
    const storedOverride = JSON.stringify({
      type: "manual",
      lat: 38.72,
      lon: -9.13,
      name: "Lisboa, Portugal",
    });
    AsyncStorage.getItem.mockResolvedValue(storedOverride);

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
      latitude: 38.72,
      longitude: -9.13,
    });

    await act(async () => {
      await result.current.clearOverride();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@location_override");

    expect(result.current.location).toEqual({
      latitude: 41.15,
      longitude: -8.61,
    });
    expect(result.current.override).toBeNull();
  });

  it("Deve combinar os estados de loading do GPS e do AsyncStorage", async () => {
    useUserLocation.mockReturnValue({
      location: null,
      isLoading: true, // GPS ainda a carregar
      refreshLocation: mockRefreshLocation,
    });

    let resolveStorage;
    AsyncStorage.getItem.mockReturnValue(
      new Promise((resolve) => {
        resolveStorage = resolve;
      })
    );

    const { result, rerender } = renderHook(() => useActiveLocation());

    // Ambos a carregar
    expect(result.current.isLoading).toBe(true);

    // Resolver AsyncStorage
    await act(async () => {
      resolveStorage(null);
    });

    // Storage terminou, GPS ainda carregando → isLoading ainda true
    expect(result.current.isLoading).toBe(true);

    // Simular GPS a terminar atualizar o mock E forçar re-render
    useUserLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
      refreshLocation: mockRefreshLocation,
    });

    // rerender() força o hook a executar novamente e apanhar o novo mock
    rerender({});

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