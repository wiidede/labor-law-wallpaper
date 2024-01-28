import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetShadcn } from './preset.shadcn'

export default defineConfig({
  shortcuts: [
    {
      'animate-accordion-up': 'accordion-up',
      'animate-accordion-down': 'accordion-down',
    },
  ],
  content: {
    pipeline: {
      include: [/\.ts/, /\.vue$/, /\.vue\?vue/],
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetShadcn(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
})
