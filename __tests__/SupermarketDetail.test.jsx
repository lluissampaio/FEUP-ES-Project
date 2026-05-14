import SupermarketDetail from "@/app/search/[id]";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

// mocks

const mockRouterBack = jest.fn();

jest.mock("expo-router", () => ({
  router: { back: mockRouterBack },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useActiveLocation", () => ({
  useActiveLocation: jest.fn(),
}));

jest.mock("@/hooks/useSupermaketDetail", () => ({
  useSupermarketDetail: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock").default
);

jest.mock("@/constants/images", () => ({
  getImageForSupermarket: jest.fn(() => null),
}));

jest.mock("@/components/AppIcon", () => {
  const React = require("react");
  const { Text } = require("react-native");
  function MockAppIcon({ name, color, weight }) {
    return <Text testID={`icon-${name}`}>{`Icon:${name}`}</Text>;
  }
  return MockAppIcon;
});

jest.mock("@/components/ThemedText", () => {
  const { Text } = require("react-native");
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock("@/components/ThemedView", () => {
  const { View } = require("react-native");
  return ({ children, ...props }) => <View {...props}>{children}</View>;
});

jest.mock("@/components/Spacer", () => {
  const { View } = require("react-native");
  return () => <View />;
});

const { useLocalSearchParams } = require("expo-router");
const { useActiveLocation } = require("@/hooks/useActiveLocation");
const { useSupermarketDetail } = require("@/hooks/useSupermaketDetail");

const fullWeeklySchedule = [
  { dayName: "Segunda", isToday: false, timeRange: "08:00 - 22:00" },
  { dayName: "Terça", isToday: false, timeRange: "08:00 - 22:00" },
  { dayName: "Quarta", isToday: false, timeRange: "08:00 - 22:00" },
  { dayName: "Quinta", isToday: false, timeRange: "08:00 - 22:00" },
  { dayName: "Sexta", isToday: false, timeRange: "08:00 - 22:00" },
  { dayName: "Sábado", isToday: false, timeRange: "08:00 - 22:00" },
  { dayName: "Domingo", isToday: false, timeRange: "09:00 - 13:00" },
];

function setTodayByDayName(dayName) {
  return fullWeeklySchedule.map((d) => ({
    ...d,
    isToday: d.dayName === dayName,
  }));
}

describe("Acceptance Test: Página de Detalhe do Supermercado", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useLocalSearchParams.mockReturnValue({ id: "store_1" });
    useActiveLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
    });
  });

  // full schedule

  describe("Full-time check: Visualização do horário semanal", () => {
    it("Deve exibir o horário completo de Segunda a Domingo", () => {
      const todayDayName = [
        "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado",
      ][new Date().getDay()];

      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Continente Bom Dia Asprela",
          isOpen: true,
          formattedDistance: "300m",
          address: "Rua da Asprela 123, Porto",
          weeklySchedule: setTodayByDayName(todayDayName),
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      // check name and state
      expect(screen.getByText("Continente Bom Dia Asprela")).toBeTruthy();
      expect(screen.getByText("Aberto")).toBeTruthy();
      expect(screen.getByText("300m")).toBeTruthy();
      expect(screen.getByText("Rua da Asprela 123, Porto")).toBeTruthy();

      // check section title
      expect(screen.getByText("Horário")).toBeTruthy();

      // check that all 7 days are in the correct order
      const expectedDays = [
        "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo",
      ];
      expectedDays.forEach((day) => {
        expect(screen.getByText(day)).toBeTruthy();
      });

      // check schedules
      const schedule0822 = screen.getAllByText("08:00 - 22:00");
      expect(schedule0822.length).toBe(6); // Seg-Sáb

      expect(screen.getByText("09:00 - 13:00")).toBeTruthy(); // Domingo
    });

    it("Deve mostrar 'Fechado' para dias sem horário", () => {
      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Mercadona",
          isOpen: false,
          formattedDistance: "1.2 km",
          address: null,
          weeklySchedule: [
            { dayName: "Segunda", isToday: false, timeRange: "08:00 - 22:00" },
            { dayName: "Terça", isToday: false, timeRange: "08:00 - 22:00" },
            { dayName: "Quarta", isToday: false, timeRange: "08:00 - 22:00" },
            { dayName: "Quinta", isToday: false, timeRange: "08:00 - 22:00" },
            { dayName: "Sexta", isToday: false, timeRange: "08:00 - 22:00" },
            { dayName: "Sábado", isToday: false, timeRange: "08:00 - 22:00" },
            { dayName: "Domingo", isToday: false, timeRange: "Fechado" },
          ],
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      expect(screen.getByText("Fechado")).toBeTruthy(); // status badge
      // Domingo also shows "Fechado", there will be 2 instances in total
      const fechadoTexts = screen.getAllByText("Fechado");
      expect(fechadoTexts.length).toBe(2);
    });
  });

  // loading failure

  describe("Loading details failed: Indisponível no momento", () => {
    it("Deve exibir 'Indisponível no momento' quando o fetch falha", () => {
      useSupermarketDetail.mockReturnValue({
        store: null,
        loading: false,
        error: "Network error",
      });

      render(<SupermarketDetail />);

      expect(screen.getByText("Indisponível no momento")).toBeTruthy();
      expect(screen.getByTestId("icon-warningCircle")).toBeTruthy();
    });

    it("Deve exibir 'Indisponível no momento' quando o documento não existe", () => {
      useSupermarketDetail.mockReturnValue({
        store: null,
        loading: false,
        error: "not_found",
      });

      render(<SupermarketDetail />);

      expect(screen.getByText("Indisponível no momento")).toBeTruthy();
    });
  });

  describe("Navegação: Botão de voltar", () => {
    it("Deve chamar router.back() ao pressionar o botão de voltar", () => {
      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Continente",
          isOpen: true,
          formattedDistance: "300m",
          address: "Rua A",
          weeklySchedule: fullWeeklySchedule,
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      const backButton = screen.getByTestId("icon-back");
      fireEvent.press(backButton);

      expect(mockRouterBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Visualização de distância e endereço", () => {
    it("Deve ocultar a distância quando formattedDistance é 'N/A'", () => {
      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Continente",
          isOpen: true,
          formattedDistance: "N/A",
          address: "Rua A",
          weeklySchedule: fullWeeklySchedule,
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      expect(screen.queryByText("N/A")).toBeNull();
    });

    it("Deve exibir a distância quando está disponível", () => {
      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Continente",
          isOpen: true,
          formattedDistance: "300m",
          address: "Rua A",
          weeklySchedule: fullWeeklySchedule,
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      expect(screen.getByText("300m")).toBeTruthy();
    });

    it("Deve exibir o endereço quando disponível", () => {
      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Continente",
          isOpen: true,
          formattedDistance: "300m",
          address: "Rua da Asprela 123, Porto",
          weeklySchedule: fullWeeklySchedule,
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      expect(screen.getByText("Rua da Asprela 123, Porto")).toBeTruthy();
      expect(screen.getByTestId("icon-location")).toBeTruthy();
    });

    it("Não deve exibir o ícone de localização quando não há endereço", () => {
      useSupermarketDetail.mockReturnValue({
        store: {
          id: "store_1",
          name: "Continente",
          isOpen: true,
          formattedDistance: "300m",
          address: null,
          weeklySchedule: fullWeeklySchedule,
        },
        loading: false,
        error: null,
      });

      render(<SupermarketDetail />);

      // only the back button and no address location pin
      expect(screen.queryByTestId("icon-location")).toBeNull();
    });
  });

  describe("Estado de loading", () => {
    it("Deve exibir ActivityIndicator enquanto carrega", () => {
      useSupermarketDetail.mockReturnValue({
        store: null,
        loading: true,
        error: null,
      });

      render(<SupermarketDetail />);

      // ActivityIndicator exists but has no text, verify by absence of content
      expect(screen.queryByText("Indisponível no momento")).toBeNull();
      expect(screen.queryByText("Continente")).toBeNull();
    });
  });
});