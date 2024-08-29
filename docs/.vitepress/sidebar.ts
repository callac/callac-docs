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
      items: [
        { text: 'Cloud-init', link: '/virtualization/pve-Cloud-init' },
        { text: '虚拟机迁移', link: '/virtualization/pve-虚拟机迁移-pve2esxi' },
        { text: '磁盘扩容', link: '/virtualization/pve-磁盘扩容' }
      ],
      
    },
  ],
  '/other/': [
    {
      text: 'mysql',
      // collapsed: true,
      items: [
        { text: '创建主从', link: '/other/MySQL-创建主从' },
      ],
    },
    {
      text: '其它',
      // collapsed: true,
      items: [
        { text: '高可用-keepalived', link: '/other/keepalived-虚拟VIP' },
        { text: 'multipass-使用', link: '/other/multipass-使用笔记' },
      ],
    },
  ],
};
