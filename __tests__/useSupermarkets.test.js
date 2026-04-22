import { useSupermarkets } from "@/hooks/useSupermarkets";
import { renderHook, waitFor } from "@testing-library/react-native";

jest.mock("firebase/firestore", () => {
  return {
    collection: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({
      docs: [
        {
          id: "store_1",
          data: () => ({
            name: "Continente Teste",
            location: { latitude: 41.15, longitude: -8.61 },
            schedule: {
              [new Date().getDay()]: { opening: 0, closing: 1439 } 
            }
          })
        }
      ]
    }))
  };
});

jest.mock("@/firebaseConfig", () => ({ db: {} }));

describe("Unit Test: Hook useSupermarkets", () => {
  it("Deve extrair, calcular e mapear os dados do Firebase corretamente", async () => {
    const { result } = renderHook(() => useSupermarkets({ latitude: 41.16, longitude: -8.61 }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    const stores = result.current.supermarkets;
    
    expect(stores).toHaveLength(1);
    expect(stores[0].name).toBe("Continente Teste");
    expect(stores[0].isOpen).toBe(true);
    expect(stores[0].formattedDistance).toContain("km");
  });
});