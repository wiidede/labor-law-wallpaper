<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: '劳动法壁纸轮播',
  meta: [
    {
      name: 'description',
      content: '中华人民共和国劳动法壁纸轮播',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#DB3832' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => '/favicon.svg',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
