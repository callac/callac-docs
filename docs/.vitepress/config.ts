import { defineConfig } from 'vitepress';

import { nav } from './nav';
import { sidebar } from './sidebar';
import { socialLinks } from './socialLinks';

export default defineConfig({
  title: 'Callac',
  base: '/callac-docs/',
  head: [
    // 图标配置
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Callac',
    socialLinks,
    nav,
    sidebar,
    outline: 'deep',
    outlineTitle: '章节目录',
    docFooter: {
      prev: '←上一篇',
      next: '下一篇→',
    },
    lastUpdatedText: '上次更新时间',
    footer: {
      message: '',
      copyright: 'xxxxx',
    },
  },
  markdown: {
    lineNumbers: false, //开启代码块行号
  },
});
