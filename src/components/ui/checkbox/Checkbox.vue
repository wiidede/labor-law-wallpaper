<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue'
import { Check, Minus } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<CheckboxRootProps>()
const emits = defineEmits<CheckboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn('peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
         $attrs.class ?? '')"
  >
    <CheckboxIndicator class="group/indicator h-full w-full flex items-center justify-center text-current">
      <Check class="h-4 w-4 group-[[data-state=indeterminate]]/indicator:hidden" />
      <Minus class="h-4 w-4 text-primary group-[[data-state=checked]]/indicator:hidden" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
