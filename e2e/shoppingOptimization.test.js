/* global device, element, by, expect, describe, beforeAll, it */

describe("Jornada E2E: Fluxo Ponta-a-Ponta de Otimização de Compras", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.setURLBlacklist([
      ".*firestore\\.googleapis\\.com.*",
      ".*Listen/channel.*",
    ]);
  });

  it("deve navegar pelas categorias, configurar quantidade/loja e validar otimização no carrinho", async () => {
    const guestButton = element(by.id("continue-as-guest"));
    await expect(guestButton).toBeVisible();
    await guestButton.tap();

    const exploreTab = element(by.text("Explorar"));
    await expect(exploreTab).toBeVisible();
    await exploreTab.tap();

    const frutasCategory = element(by.id("category-card-frutas_vegetais"));
    await expect(frutasCategory).toBeVisible();
    await frutasCategory.tap();

    const viewOffersButton = element(by.text("Ver Ofertas")).atIndex(0);
    await expect(viewOffersButton).toBeVisible();
    await viewOffersButton.tap();

    const incrementButton = element(by.label("Aumentar quantidade"));
    await expect(incrementButton).toBeVisible();
    await incrementButton.tap();
    await incrementButton.tap();

    const addToCartButton = element(by.id("add-to-cart-footer-button"));
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.tap();

    const cartTab = element(by.text("Lista"));
    await expect(cartTab).toBeVisible();
    await cartTab.tap();

    await expect(element(by.id("cart-item-name")).atIndex(0)).toBeVisible();
    await expect(element(by.id("item-quantity")).atIndex(0)).toHaveText("3");
    await expect(element(by.id("cart-total-estimated-value"))).toBeVisible();
  });
});
