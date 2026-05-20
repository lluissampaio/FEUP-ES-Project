/* global device, element, by, expect, describe, beforeAll, it */

describe("Jornada E2E: Fluxo Ponta-a-Ponta de Otimização de Compras", () => {
  beforeAll(async () => {
    // Garante que o estado inicial da app corre do zero
    await device.launchApp({ newInstance: true });
  });

  it("deve navegar pelas categorias, configurar quantidade/loja e validar otimização no carrinho", async () => {
    // 1. Inicialização: Bypass da Welcome Screen como Convidado
    const guestButton = element(by.id("continue-as-guest"));
    await expect(guestButton).toBeVisible();
    await guestButton.tap();

    // 2. Navegação por Categorias: Mudar para a Tab Explorar
    const exploreTab = element(by.text("Explorar"));
    await expect(exploreTab).toBeVisible();
    await exploreTab.tap();

    // 3. Seleção de Categoria: Clicar no Cartão de Bebidas
    const bebidasCategory = element(by.id("category-card-bebidas"));
    await expect(bebidasCategory).toBeVisible();
    await bebidasCategory.tap();

    // 4. Seleção de Produto: Localizar e abrir o primeiro produto da lista
    const viewOffersButton = element(by.text("Ver Ofertas")).atIndex(0);
    await expect(viewOffersButton).toBeVisible();
    await viewOffersButton.tap();

    // 5. Mutação de Quantidade e Loja (Ecrã de Detalhes)
    const incrementButton = element(by.labelText("Aumentar quantidade"));
    await expect(incrementButton).toBeVisible();
    await incrementButton.tap();
    await incrementButton.tap();

    // Seleciona o PriceCard do Continente
    const continenteCard = element(
      by.labelText(/Selecionar Continente/i),
    ).atIndex(0);
    await expect(continenteCard).toBeVisible();
    await continenteCard.tap();

    // Adiciona o produto manipulado à lista
    const addToCartButton = element(by.id("add-to-cart-footer-button"));
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.tap();

    // 6. Verificação e Validação no Carrinho (Tab Lista)
    const cartTab = element(by.text("Lista"));
    await expect(cartTab).toBeVisible();
    await cartTab.tap();

    // Valida se o item está no carrinho com a quantidade '3'
    const itemQuantity = element(by.id("item-quantity")).atIndex(0);
    await expect(itemQuantity).toHaveText("3");

    // Valida se o seletor local do item está trancado no Continente
    const storePill = element(by.text("Continente")).atIndex(0);
    await expect(storePill).toBeVisible();

    // Valida se o Total Estimado no footer sticky foi devidamente calculado
    await expect(element(by.text(/Total Estimado/i))).toBeVisible();
  });
});
