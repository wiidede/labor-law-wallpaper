<script setup lang="ts">
import type { AccordionItemProps } from 'radix-vue'
import { AccordionItem } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<AccordionItemProps & { class?: string }>()
</script>

<template>
  <AccordionItem
    v-bind="props"
    :class="cn('border-b', props.class ?? '')"
  >
    <slot />
  </AccordionItem>
</template>
