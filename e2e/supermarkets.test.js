const { device, element, by, expect } = require("detox");

describe("Jornada: Filtragem e Comparação de Supermercados", () => {
  beforeAll(async () => {
    // newInstance: true garante que a app arranca do zero, limpando estado em memória
    await device.launchApp({ newInstance: true });
  });

  it("deve fixar localização manual, filtrar por distância e validar loja", async () => {
    // Navegar para Tab Perfil
    await element(by.text("Perfil")).tap();

    // Navegar para ecrã de Localização
    await expect(element(by.text("Localização"))).toBeVisible();
    await element(by.text("Localização")).tap();

    // Pesquisar localização específica ("Porto")
    await expect(element(by.id("location-search-input"))).toBeVisible();
    // typeText simula a escrita. O \n submete o teclado (onSubmitEditing)
    await element(by.id("location-search-input")).typeText("Porto\n");

    // Aguardar resposta da rede (Photon API) e selecionar resultado
    const locationResult = element(by.text("Porto, Portugal"));
    await expect(locationResult).toBeVisible();
    await locationResult.tap();

    // Validar que o override ficou ativo na UI
    await expect(element(by.text("Localização manual ativa"))).toBeVisible();

    // Voltar ao Tab Início
    await element(by.text("Ínicio")).tap();

    // Aceder à pesquisa de supermercados
    await expect(element(by.id("home-search-bar"))).toBeVisible();
    await element(by.id("home-search-bar")).tap();

    // Abrir filtro de distância
    await expect(element(by.id("filter-distance-dropdown"))).toBeVisible();
    await element(by.id("filter-distance-dropdown")).tap();

    // Selecionar o raio "< 5 km"
    await expect(element(by.id("filter-option-5"))).toBeVisible();
    await element(by.id("filter-option-5")).tap();

    // Lojas fora do Porto (> 5km) não podem existir
    await expect(element(by.id("store-card-ID_LOJA_FARO"))).toNotExist();

    // Loja no Porto (< 5km) tem de estar visível e ser interagível
    const validStore = element(by.id("store-card-ID_LOJA_PORTO"));
    await expect(validStore).toBeVisible();
    await validStore.tap();

    // Validação de rendering do SupermarketDetail
    await expect(element(by.text("Horário"))).toBeVisible();
  });
});
