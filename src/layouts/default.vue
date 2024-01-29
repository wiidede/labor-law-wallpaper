<template>
  <main
    text="gray-700 dark:gray-200"
  >
    <ScrollArea v-if="isWindows" class="screen-size">
      <RouterView />
    </ScrollArea>
    <RouterView v-else />
  </main>
</template>
