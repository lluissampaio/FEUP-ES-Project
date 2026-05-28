// constants/categories.js
export const CATEGORY_GRID_DATA = [
  { id: "tudo", label: "Tudo", themeKey: "gray", asset: "default" },
  {
    id: "frutas_vegetais",
    label: "Frutas e Vegetais",
    themeKey: "green",
    asset: "frutas_vegetais",
  },
  {
    id: "mercearia",
    label: "Mercearia",
    themeKey: "orange",
    asset: "mercearia",
  },
  { id: "talho", label: "Carne e Peixe", themeKey: "red", asset: "talho" },
  {
    id: "padaria",
    label: "Padaria e Doces",
    themeKey: "purple",
    asset: "padaria",
  },
  { id: "laticinio", label: "Laticínios", themeKey: "yellow", asset: "leite" },
  { id: "bebidas", label: "Bebidas", themeKey: "blue", asset: "bebidas" },
];

export const CATEGORY_THEME_MAP = {
  gray: {
    lightBg: "#F2F3F2",
    darkBg: "#2f2b3d",
    lightText: "#181725",
    darkText: "#ffffff",
    border: "#7C7C7C33",
  },
  green: {
    lightBg: "#EEF8F2",
    darkBg: "#1a2e22",
    lightText: "#2A6B42",
    darkText: "#81E6A1",
    border: "#2A6B4244",
  },
  orange: {
    lightBg: "#FFF6EE",
    darkBg: "#332417",
    lightText: "#A05313",
    darkText: "#FFB066",
    border: "#A0531344",
  },
  red: {
    lightBg: "#FDEEEF",
    darkBg: "#33191b",
    lightText: "#A6262C",
    darkText: "#FF7379",
    border: "#A6262C44",
  },
  purple: {
    lightBg: "#F4EBF7",
    darkBg: "#291b30",
    lightText: "#6E2B8A",
    darkText: "#DDA6F5",
    border: "#6E2B8A44",
  },
  yellow: {
    lightBg: "#FFF9E5",
    darkBg: "#332c14",
    lightText: "#8A6D00",
    darkText: "#FFE57F",
    border: "#8A6D0044",
  },
  blue: {
    lightBg: "#EDF7FC",
    darkBg: "#142533",
    lightText: "#1A5B8C",
    darkText: "#7FCAFF",
    border: "#1A5B8C44",
  },
};
