import SupermarketCard from "@/components/SupermarketCard";
import { render, screen } from "@testing-library/react-native";

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

describe("Unit Test: Componente SupermarketCard", () => {
  it("Deve renderizar corretamente o estado 'Aberto' com horário", () => {
    render(
      <SupermarketCard
        name="Continente"
        distance="2.5 km"
        isOpen={true}
        scheduleToday="8h-22h"
      />,
    );

    expect(screen.getByText("Continente")).toBeTruthy();
    expect(screen.getByText("2.5 km")).toBeTruthy();
    expect(screen.getByText("Aberto")).toBeTruthy();
    expect(screen.getByText("Hoje: 8h-22h")).toBeTruthy();
  });

  it("Deve renderizar 'Fechado' e ocultar horário se scheduleToday não for passado", () => {
    render(
      <SupermarketCard name="Mercadona" distance="5.0 km" isOpen={false} />,
    );

    expect(screen.getByText("Mercadona")).toBeTruthy();
    expect(screen.getByText("Fechado")).toBeTruthy();

    expect(screen.queryByText(/Hoje:/)).toBeNull();
  });
});
