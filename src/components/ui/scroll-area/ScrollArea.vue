<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaViewport,
} from 'radix-vue'
import ScrollBar from './ScrollBar.vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<
    ScrollAreaRootProps & { class?: string }
  >(),
  {
    class: '',
    orientation: 'vertical',
  },
)

const scrollAreaViewport = ref<InstanceType<typeof ScrollAreaViewport>>()
const elRef = computed(() => scrollAreaViewport.value?.viewportElement)
const { isScrolling } = useScroll(elRef, {
  behavior: 'smooth',
  idle: 500,
})
</script>

<template>
  <ScrollAreaRoot :type="type" :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport ref="scrollAreaViewport" class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar v-show="isScrolling" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
