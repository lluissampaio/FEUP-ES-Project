/* global device, element, by, expect, describe, beforeAll, it, waitFor */

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
    await waitFor(guestButton).toBeVisible().withTimeout(10000);
    await guestButton.tap();

    const exploreTab = element(by.text("Explorar"));
    await waitFor(exploreTab).toBeVisible().withTimeout(5000);
    await exploreTab.tap();

    const frutasCategory = element(by.id("category-card-frutas_vegetais"));
    await waitFor(frutasCategory).toBeVisible().withTimeout(5000);
    await frutasCategory.tap();

    const viewOffersButton = element(by.text("Ver Ofertas")).atIndex(0);
    await waitFor(viewOffersButton).toBeVisible().withTimeout(10000);
    await viewOffersButton.tap();

    const incrementButton = element(by.label("Aumentar quantidade"));
    await waitFor(incrementButton).toBeVisible().withTimeout(5000);
    await incrementButton.tap();
    await incrementButton.tap();

    const addToCartButton = element(by.id("add-to-cart-footer-button"));
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.tap();

    const cartTab = element(by.text("Lista"));
    await expect(cartTab).toBeVisible();
    await cartTab.tap();

    const firstCartItem = element(by.id("cart-item-name")).atIndex(0);
    await waitFor(firstCartItem).toBeVisible().withTimeout(5000);

    await expect(element(by.id("item-quantity")).atIndex(0)).toHaveText("3");
    await expect(element(by.id("cart-total-estimated-value"))).toBeVisible();
  });
});
