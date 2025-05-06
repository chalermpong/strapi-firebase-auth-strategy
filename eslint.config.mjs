// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'indent': [2, 2, {'SwitchCase': 1}],
      'linebreak-style': ['error', 'unix'],
      'no-console': [2],
      'quotes': ['error', 'single'],
      'semi': [2, 'never'],
      'object-curly-spacing': [2, 'never'],
      '@typescript-eslint/no-explicit-any': [0],
    },
  }
)
