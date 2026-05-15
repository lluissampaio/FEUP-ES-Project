import SupermarketCard from "@/components/SupermarketCard";
import { render, screen } from "@testing-library/react-native";

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

describe("Unit Test: SupermarketCard — detalhe e N/A guard", () => {
  it("Deve renderizar 'Ver mais' em todos os estados", () => {
    render(
      <SupermarketCard
        name="Continente"
        distance="2.5 km"
        isOpen={true}
        scheduleToday="8h-22h"
      />,
    );

    expect(screen.getByText("Ver mais")).toBeTruthy();
  });

  it("Deve ocultar a distância quando é 'N/A'", () => {
    render(
      <SupermarketCard
        name="Continente"
        distance="N/A"
        isOpen={true}
        scheduleToday="8h-22h"
      />,
    );

    expect(screen.queryByText("N/A")).toBeNull();
  });

  it("Deve renderizar a distância quando é válida", () => {
    render(
      <SupermarketCard
        name="Continente"
        distance="300m"
        isOpen={true}
        scheduleToday="8h-22h"
      />,
    );

    expect(screen.getByText("300m")).toBeTruthy();
  });

  it("Deve renderizar 'Hoje: Indisponível' quando scheduleToday é 'Indisponível'", () => {
    render(
      <SupermarketCard
        name="Continente"
        distance="2.5 km"
        isOpen={false}
        scheduleToday="Indisponível"
      />,
    );

    expect(screen.getByText("Hoje: Indisponível")).toBeTruthy();
  });

  it("Deve renderizar 'Ver mais' mesmo quando fechado e sem distância", () => {
    render(<SupermarketCard name="Mercadona" distance="N/A" isOpen={false} />);

    expect(screen.getByText("Ver mais")).toBeTruthy();
    expect(screen.queryByText("N/A")).toBeNull();
  });
});
