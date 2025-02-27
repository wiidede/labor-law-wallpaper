<script setup lang="ts">
import type { AccordionRootEmits, AccordionRootProps } from 'radix-vue'
import {
  AccordionRoot,

  useEmitAsProps,
} from 'radix-vue'

const props = defineProps<AccordionRootProps>()
const emits = defineEmits<AccordionRootEmits>()
</script>

<template>
  <AccordionRoot v-bind="{ ...props, ...useEmitAsProps(emits) }">
    <slot />
  </AccordionRoot>
</template>
