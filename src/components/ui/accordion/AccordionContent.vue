<script setup lang="ts">
import type { AccordionContentProps } from 'radix-vue'
import { AccordionContent } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<AccordionContentProps & { class?: string }>()
</script>

<template>
  <AccordionContent
    v-bind="props"
    :class="
      cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        props.class,
      )
    "
  >
    <div class="pb-4 pt-0">
      <slot />
    </div>
  </AccordionContent>
</template>
