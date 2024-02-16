import { DefaultTheme } from 'vitepress';

// https://vitepress.vuejs.org/guide/theme-sidebar
export const sidebar: DefaultTheme.Sidebar = {
  '/virtualization/': [
    {
      text: 'ESXI',
      // collapsed: true,
      items: [
        { text: '编译安装群晖', link: '/virtualization/esxi-编译安装群晖' },
      ],
    },
    {
      text: 'PVE',
      // collapsed: true,
      items: [{ text: '虚拟机迁移', link: '/virtualization/pve-虚拟机迁移-pve2esxi' }],
    },
  ],
};
