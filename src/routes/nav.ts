import { paths } from "./paths";

export type NavItem = {
  label: string;
  path: string;
};

export const privateNavItems: NavItem[] = [
  { label: "Cuenta", path: paths.dashboard },
  { label: "Servicios", path: paths.services },
  { label: "Más", path: paths.more },
];


export const publicNavItems = [
  {
    label: "Inicio",
    path: paths.home,
  },
  {
    label: "Soporte",
    path: paths.support,
  },
];