import {
  CaretLeft,
  Crosshair,
  CaretRight,
  Heart,
  Info,
  List,
  LockSimpleOpen,
  MagnifyingGlass,
  MapPin,
  PencilSimple,
  Question,
  Ruler,
  ShoppingCart,
  Storefront,
  User,
  WarningCircle,
  MapTrifold,
  Eye,
  EyeSlash,
  EyeSlashIcon,
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
  crosshair: Crosshair,
  help: Question,
  about: Info,
  edit: PencilSimple,
  // UI & Navegação
  menu: List,
  back: CaretLeft,
  chevronRight: CaretRight,
  ruler: Ruler,
  "lock-simple-open": LockSimpleOpen,
  map: MapTrifold,
  warningCircle: WarningCircle,
  // Eye icon
  eye: Eye,
  eyeSlash: EyeSlash,
};