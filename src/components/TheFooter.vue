<script setup lang="ts">
</script>

<template>
  <nav flex="~ gap-4" mt-6 justify-center text-xl>
    <button icon-btn title="切换暗黑模式" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>

    <a icon-btn rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>
