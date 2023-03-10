import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface SitebarItem {
  text: string;
  link: string;
}

export interface SidebarGroup {
  text: string;
  items: SitebarItem[];
}

export interface Sidebar {
  [path: string]: SidebarGroup[];
}

export interface Footer {
  message: string;
}

export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface UserConfig {
  title: string;
  description: string;
  themeConfig: ThemeConfig;
  vite: ViteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}
