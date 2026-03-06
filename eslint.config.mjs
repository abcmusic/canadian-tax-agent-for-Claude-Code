import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import security from 'eslint-plugin-security'
import prettierConfig from 'eslint-config-prettier'

export default [
  { ignores: ['dist/', 'node_modules/', 'workspace/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'security/detect-object-injection': 'warn',
    },
  },
]
