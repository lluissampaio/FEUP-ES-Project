import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

describe("Unit Test: Utils - capitalizeFirstLetter", () => {
  it("Capitalizes the first letter of a standard string", () => {
    expect(capitalizeFirstLetter("mercearia")).toBe("Mercearia");
  });

  it("Returns null when provided with falsy inputs", () => {
    expect(capitalizeFirstLetter(null)).toBeNull();
    expect(capitalizeFirstLetter("")).toBeNull();
    expect(capitalizeFirstLetter(undefined)).toBeNull();
  });

  it("Preserves the rest of the string exactly as is", () => {
    expect(capitalizeFirstLetter("pINGO DOCE")).toBe("PINGO DOCE");
  });
});
