/* global device, element, by, expect, describe, beforeAll, it, waitFor */

describe("Jornada: Filtragem e Comparação de Supermercados", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.setURLBlacklist([
      ".*firestore\\.googleapis\\.com.*",
      ".*Listen/channel.*",
    ]);
  });

  it("deve fixar localização manual, filtrar por distância e validar loja", async () => {
    const guestButton = element(by.id("continue-as-guest"));
    await expect(guestButton).toBeVisible();
    await guestButton.tap();

    await element(by.text("Perfil")).tap();

    await expect(element(by.text("Localização"))).toBeVisible();
    await element(by.text("Localização")).tap();

    await expect(element(by.id("location-search-input"))).toBeVisible();
    await element(by.id("location-search-input")).typeText("FEUP\n");

    const locationResult = element(
      by.text(
        "Faculdade de Engenharia da Universidade do Porto, Porto, Portugal",
      ),
    ).atIndex(0);
    await waitFor(locationResult).toBeVisible().withTimeout(10000);
    await locationResult.tap();

    await expect(element(by.text("Localização manual ativa"))).toBeVisible();

    const backBtn = element(by.id("location-back-button"));
    await expect(backBtn).toBeVisible();
    await backBtn.tap();

    await element(by.text("Início")).tap();

    const homeSearchBar = element(by.id("home-search-bar"));
    await expect(homeSearchBar).toBeVisible();
    await homeSearchBar.tap();

    await expect(element(by.id("filter-distance-dropdown"))).toBeVisible();
    await element(by.id("filter-distance-dropdown")).tap();

    await expect(element(by.id("filter-option-10"))).toBeVisible();
    await element(by.id("filter-option-10")).tap();

    const firstCard = element(by.text("Ver mais")).atIndex(0);
    await waitFor(firstCard).toBeVisible().withTimeout(10000);
    await firstCard.tap();

    await waitFor(element(by.text("Horário")))
      .toBeVisible()
      .withTimeout(5000);
  });
});
