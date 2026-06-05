export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  support: "/support",
  dashboard: "/dashboard",
  services: "/services",
  more: "/more",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];