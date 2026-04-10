import { formatTime } from "@/utils/time";

describe("Unit Test: Utils de Tempo (formatTime)", () => {
  it("Deve formatar horas certas sem os minutos zero", () => {
    expect(formatTime(480)).toBe("8h");
  });

  it("Deve formatar horas e minutos corretamente", () => {
    expect(formatTime(510)).toBe("8h30");
  });

  it("Deve adicionar padding (zero à esquerda) a minutos menores que 10", () => {
    expect(formatTime(545)).toBe("9h05");
  });
});