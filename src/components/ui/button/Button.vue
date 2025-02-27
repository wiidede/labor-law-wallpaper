<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import type { PrimitiveProps } from 'radix-vue'
import { Primitive } from 'radix-vue'
import { cn } from '~/lib/utils'
import { buttonVariants } from '.'

interface ButtonVariantProps extends VariantProps<typeof buttonVariants> {}

interface Props extends PrimitiveProps {
  variant?: ButtonVariantProps['variant']
  size?: ButtonVariantProps['size']
  as?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </Primitive>
</template>
