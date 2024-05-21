import { presetIcons } from 'unocss'
import { presetWind } from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { presetAttributify } from 'unocss'
import { defineConfig } from 'unocss/vite'

export default defineConfig({
  presets: [
    presetWind(),
    presetAttributify(),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
  shortcuts: {
    'flex-c': 'flex justify-center items-center',
    'flex-bc': 'flex justify-between items-center',
    'flex-ac': 'flex justify-around items-center',
  },
  theme: {
    colors: {},
  },
  transformers: [transformerVariantGroup(), transformerAttributifyJsx(), transformerDirectives()],
})
