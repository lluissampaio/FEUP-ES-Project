/* global device, element, by, expect, describe, beforeAll, it, waitFor */

describe("Jornada: Checklist de Compras", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.setURLBlacklist([
      ".*firestore\\.googleapis\\.com.*",
      ".*Listen/channel.*",
    ]);
  });

  it("deve exibir lista vazia, adicionar produto, riscá-lo e limpar a lista", async () => {
    const guestButton = element(by.id("continue-as-guest"));
    await expect(guestButton).toBeVisible();
    await guestButton.tap();

    await element(by.text("Lista")).tap();
    await expect(element(by.text("empty list"))).toBeVisible();
    
    await element(by.text("Ínicio")).tap();

    await element(by.text("Explorar")).tap();
    
    const categoryCard = element(by.id("category-card-frutas_vegetais"));
    await waitFor(categoryCard).toBeVisible().withTimeout(5000);
    await categoryCard.tap();

    const firstProductButton = element(by.text("Ver Ofertas")).atIndex(0);
    await waitFor(firstProductButton).toBeVisible().withTimeout(10000);
    await firstProductButton.tap();

    const addToCartButton = element(by.id("add-to-cart-footer-button"));
    await waitFor(addToCartButton).toBeVisible().withTimeout(5000);
    await addToCartButton.tap();

    await element(by.text("Lista")).tap();
    
    const cartItem = element(by.id("cart-item")).atIndex(0);
    await waitFor(cartItem).toBeVisible().withTimeout(5000);
    await expect(element(by.text("empty list"))).not.toBeVisible();
    await expect(element(by.text("Total Estimado"))).toBeVisible();

    const checkbox = element(by.id("item-checkbox")).atIndex(0);
    await expect(checkbox).toBeVisible();
    await checkbox.tap();

    await expect(element(by.text("Lista Completa"))).toBeVisible();

    const clearButton = element(by.id("clear-list-button"));
    await expect(clearButton).toBeVisible();
    await clearButton.tap();

    await expect(element(by.text("Limpar"))).toBeVisible();
    await element(by.text("Limpar")).tap();

    await expect(element(by.text("empty list"))).toBeVisible();
  });
});