import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu({
  react: true,
}, ...pluginQuery.configs['flat/recommended'], ...tailwind.configs['flat/recommended'])
