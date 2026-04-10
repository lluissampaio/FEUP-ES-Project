export const SUPERMARKET_LOGOS = {
  continente: require("@/assets/logos/continente.png"),
  pingo_doce: require("@/assets/logos/pingodoce.png"),
  mercadona: require("@/assets/logos/mercadona.png"),
  lidl: require("@/assets/logos/lidl.png"),
  aldi: require("@/assets/logos/aldi.png"),
  default: require("@/assets/logos/default.png"),
};

export const getLogoForSupermarket = (name) => {
  const normalizedName = name.toLowerCase().replace(/\s/g, "");
  
  if (normalizedName.includes("continente")) return SUPERMARKET_LOGOS.continente;
  if (normalizedName.includes("pingodoce")) return SUPERMARKET_LOGOS.pingo_doce;
  if (normalizedName.includes("mercadona")) return SUPERMARKET_LOGOS.mercadona;
  if (normalizedName.includes("lidl")) return SUPERMARKET_LOGOS.lidl;
  if (normalizedName.includes("aldi")) return SUPERMARKET_LOGOS.aldi;

  return SUPERMARKET_LOGOS.default;
};