import {
  CaretLeft,
  CaretRight,
  Heart,
  Info,
  List,
  MagnifyingGlass,
  MapPin,
  PencilSimple,
  Question,
  ShoppingCart,
  Storefront,
  User,
} from "phosphor-react-native";

export const ICON_MAP = {
  // Tab Bar
  shop: Storefront,
  explore: MagnifyingGlass,
  cart: ShoppingCart,
  favourite: Heart,
  account: User,
  // Account Tab
  location: MapPin,
  help: Question,
  about: Info,
  edit: PencilSimple,
  // UI & Navegação
  menu: List,
  back: CaretLeft,
  chevronRight: CaretRight,
};
