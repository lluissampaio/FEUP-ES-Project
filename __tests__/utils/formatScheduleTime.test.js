import { formatScheduleTime } from "@/utils/time";

describe("Unit Test: formatScheduleTime", () => {
  it("Deve formatar meia-noite como 00:00", () => {
    expect(formatScheduleTime(0)).toBe("00:00");
  });

  it("Deve formatar horas exias com padding zero à esquerda", () => {
    expect(formatScheduleTime(480)).toBe("08:00");
    expect(formatScheduleTime(1320)).toBe("22:00");
  });

  it("Deve formatar horas e minutos corretamente", () => {
    expect(formatScheduleTime(510)).toBe("08:30");
    expect(formatScheduleTime(545)).toBe("09:05");
  });

  it("Deve formatar o último minuto do dia", () => {
    expect(formatScheduleTime(1439)).toBe("23:59");
  });

  it("Deve aplicar padding zero a minutos menores que 10", () => {
    expect(formatScheduleTime(481)).toBe("08:01");
    expect(formatScheduleTime(60)).toBe("01:00");
  });
});
