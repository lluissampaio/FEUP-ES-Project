jest.mock("@/firebaseConfig", () => ({
  auth: { currentUser: { uid: "test-uid" } },
  db: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: "test-uid" });
    return jest.fn();
  }),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({ exists: () => false, data: () => ({ items: [] }) });
    return jest.fn();
  }),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
}));

import useList from "@/hooks/useList";
import { renderHook, waitFor } from "@testing-library/react-native";

describe("Hook useCart", () => {
  it("deve iniciar com estado empty via mock", async () => {
    const { result } = renderHook(() => useList());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual([]);
  });
});
