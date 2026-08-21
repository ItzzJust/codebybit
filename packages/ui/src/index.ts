// icons
export {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CircleCheck,
  CircleExclamation,
  CircleInfo,
  CircleXmark,
  Ellipsis,
  Magnifier,
  Minus,
  Xmark,
} from "./icons";
export type { IconProps } from "./icons/arrow-down";

// shadcn/ui components
export * from "./components/ui/accordion";
export * from "./components/ui/alert-dialog";
export * from "./components/ui/alert";
export * from "./components/ui/aspect-ratio";
export * from "./components/ui/attachment";
export * from "./components/ui/avatar";
export * from "./components/ui/badge";
export * from "./components/ui/breadcrumb";
export * from "./components/ui/bubble";
export * from "./components/ui/button-group";
export * from "./components/ui/button";
export * from "./components/ui/calendar";
export * from "./components/ui/card";
export * from "./components/ui/carousel";
export * from "./components/ui/chart";
export * from "./components/ui/checkbox";
export * from "./components/ui/collapsible";
export * from "./components/ui/combobox";
export { MultiSelectCombobox } from "./components/ui/multi-select-combobox";
export type { MultiSelectComboboxProps } from "./components/ui/multi-select-combobox";
export * from "./components/ui/command";
export * from "./components/ui/context-menu";
export * from "./components/ui/dialog";
export * from "./components/ui/direction";
export * from "./components/ui/drawer";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/empty";
export * from "./components/ui/field";
export * from "./components/ui/hover-card";
export * from "./components/ui/input-group";
export * from "./components/ui/input-otp";
export * from "./components/ui/input";
export * from "./components/ui/item";
export * from "./components/ui/kbd";
export * from "./components/ui/label";
export * from "./components/ui/marker";
export * from "./components/ui/menubar";
export * from "./components/ui/message-scroller";
export * from "./components/ui/message";
export * from "./components/ui/native-select";
export * from "./components/ui/navigation-menu";
export * from "./components/ui/pagination";
export * from "./components/ui/popover";
export * from "./components/ui/progress";
export * from "./components/ui/questionnaire";
export * from "./components/ui/radio-group";
export * from "./components/ui/resizable";
export * from "./components/ui/scroll-area";
export * from "./components/ui/select";
export * from "./components/ui/separator";
export * from "./components/ui/sheet";
export * from "./components/ui/sidebar";
export * from "./components/ui/skeleton";
export * from "./components/ui/slider";
export * from "./components/ui/spinner";
export * from "./components/ui/switch";
export * from "./components/ui/table";
export * from "./components/ui/tabs";
export * from "./components/ui/textarea";
export * from "./components/ui/toast";
export * from "./components/ui/toggle-group";
export * from "./components/ui/toggle";
export * from "./components/ui/tooltip";

// beui motion components (primitives like motion Checkbox/Input/Button that
// would collide with the shadcn/ui exports above live at
// `@codebybit/ui/components/motion/*` and are imported via subpath)
export {
  ActionSwapButton,
  ActionSwapIcon,
  ActionSwapText,
} from "./components/motion/action-swap";
export { MagneticButton, StatefulButton } from "./components/motion/button";
export { ChromaticTextReveal } from "./components/motion/chromatic-text-reveal";
export { Magnetic } from "./components/motion/magnetic";
export * from "./components/motion/not-found";
export { SignInForm } from "./components/motion/signin-form";
export { SignUpForm, passwordStrength } from "./components/motion/signup-form";
export { TextReveal } from "./components/motion/text-reveal";
export { ThemeToggle, useThemeToggle } from "./components/motion/theme-toggle";

// custom components
export { CategoryCard } from "./components/custom/category-card";
export type { CategoryCardProps } from "./components/custom/category-card";
export { Logo } from "./components/custom/logo";
export { Navbar } from "./components/custom/navbar";
export { default as NotFound } from "./components/custom/not-found";
export { PageHeader } from "./components/custom/page-header";
export type { PageHeaderProps } from "./components/custom/page-header";

// sections
export { Hero } from "./sections/hero";
export type { HeroProps, HeroAction } from "./sections/hero";
export { ResourceCategories } from "./sections/resource-categories";
export type {
  ResourceCategoriesProps,
  ResourceCategory,
} from "./sections/resource-categories";
export { MinecraftLayout } from "./sections/minecraft-layout";
export type { MinecraftLayoutProps } from "./sections/minecraft-layout";

// minecraft filters (types & pure functions)
export type {
  FilterOption,
  ResourceSearch,
  FilterSection,
  FilterKey,
} from "./components/custom/minecraft-filters";
export {
  normalizeList,
  sanitizeSearch,
  filterSections,
  allFilterKeys,
} from "./components/custom/minecraft-filters";

// utilities
export { cn } from "./lib/utils";
export type { ClassValue } from "clsx";
export { useHoverCapable } from "./hooks/use-hover-capable";
export { useIsMobile } from "./hooks/use-mobile";
export * from "./lib/ease";
