<script setup lang="ts">
</script>

<template>
  <nav flex="~ gap-4" my-3 justify-center text-xl>
    <button icon-btn title="切换暗黑模式" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>
    <RouterLink class="icon-btn" to="https://wiidede.space/sponsor" title="赞助">
      <div i-carbon-favorite />
    </RouterLink>
    <a icon-btn rel="noreferrer" href="https://github.com/wiidede/labor-law-wallpaper" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>
