import { DefaultTheme } from 'vitepress';

/**
 * 顶部导航栏模块
 * 详细参考：https://vitepress.vuejs.org/guide/theme-nav
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: '虚拟化',
    link: '/virtualization/简介',
    activeMatch: '/virtualization/',
  },
  {
    text: '杂记',
    link: '/other/简介',
    activeMatch: '/other/',
  },
];
