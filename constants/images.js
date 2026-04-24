export const SUPERMARKET_IMAGES = {
  continente: require("@/assets/supermarkets/continente.png"),
  pingo_doce: require("@/assets/supermarkets/pingodoce.png"),
  mercadona: require("@/assets/supermarkets/mercadona.png"),
  lidl: require("@/assets/supermarkets/lidl.png"),
  aldi: require("@/assets/supermarkets/aldi.png"),
  default: require("@/assets/supermarkets/default.png"),
};

export const PRODUCT_IMAGES = {
  bebidas: require("@/assets/products/bebidas.png"),
  frutas_vegetais: require("@/assets/products/frutas_vegetais.png"),
  leite: require("@/assets/products/leite.png"),
  mercearia: require("@/assets/products/mercearia.png"),
  peixaria: require("@/assets/products/peixaria.png"),
  snacks: require("@/assets/products/snacks.png"),
  talho: require("@/assets/products/talho.png"),
  congelados: require("@/assets/products/congelados.png"),
  padaria: require("@/assets/products/padaria.png"),
  default: require("@/assets/products/default.png"), 
};

export const getImageForSupermarket = (name) => {
  if (!name) return SUPERMARKET_IMAGES.default;

  const normalizedName = name.toLowerCase().replace(/\s/g, "");
  
  if (normalizedName.includes("continente")) return SUPERMARKET_IMAGES.continente;
  if (normalizedName.includes("pingodoce")) return SUPERMARKET_IMAGES.pingo_doce;
  if (normalizedName.includes("mercadona")) return SUPERMARKET_IMAGES.mercadona;
  if (normalizedName.includes("lidl")) return SUPERMARKET_IMAGES.lidl;
  if (normalizedName.includes("aldi")) return SUPERMARKET_IMAGES.aldi;

  return SUPERMARKET_IMAGES.default;
};

export const getImageForProductCategory = (category) => {
  if (!category) return PRODUCT_IMAGES.default;

  const normalizedCategory = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (normalizedCategory.includes("bebida")) return PRODUCT_IMAGES.bebidas;
  if (normalizedCategory.includes("fruta") || normalizedCategory.includes("vegetal")) return PRODUCT_IMAGES.frutas_vegetais;
  if (normalizedCategory.includes("leite") || normalizedCategory.includes("laticinio")) return PRODUCT_IMAGES.leite;
  if (normalizedCategory.includes("peixaria") || normalizedCategory.includes("peixe")) return PRODUCT_IMAGES.peixaria;
  if (normalizedCategory.includes("snack")) return PRODUCT_IMAGES.snacks;
  if (normalizedCategory.includes("talho") || normalizedCategory.includes("carne")) return PRODUCT_IMAGES.talho;
  if (normalizedCategory.includes("mercearia")) return PRODUCT_IMAGES.mercearia;
  if (normalizedCategory.includes("congelados")) return PRODUCT_IMAGES.congelados;
  if (normalizedCategory.includes("padaria")) return PRODUCT_IMAGES.padaria;

  return PRODUCT_IMAGES.default;
};