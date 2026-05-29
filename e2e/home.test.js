/* global device, element, by, expect, describe, beforeAll, it, waitFor */

describe("Jornada E2E: Navegação no Ecrã Inicial (Promoções e Eco)", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.setURLBlacklist([
      ".*firestore\\.googleapis\\.com.*",
      ".*Listen/channel.*",
    ]);
  });

  it("deve validar a secção de promoções, abrir produto e voltar à Home", async () => {
    const guestButton = element(by.id("continue-as-guest"));
    await expect(guestButton).toBeVisible();
    await guestButton.tap();

    const promoHeader = element(by.text("Melhores Promoções"));
    await waitFor(promoHeader).toBeVisible().withTimeout(10000);

    const firstPromoButton = element(by.text("Ver Ofertas")).atIndex(0);
    await waitFor(firstPromoButton).toBeVisible().withTimeout(5000);
    await firstPromoButton.tap();

    const addToCartButton = element(by.id("add-to-cart-footer-button"));
    await waitFor(addToCartButton).toBeVisible().withTimeout(10000);

    const backButton = element(by.label("Voltar")).atIndex(0);
    await expect(backButton).toBeVisible();
    await backButton.tap();

    await expect(promoHeader).toBeVisible();
  });
});
