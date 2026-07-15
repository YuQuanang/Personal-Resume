import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // Node.js files (server + seed scripts)
  {
    files: ['server.js', 'seed.js', 'netlify/functions/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // React / browser source files
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['server.js', 'seed.js'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 17+ JSX transform: `import React from 'react'` is not required
      // but harmless — allow it without triggering no-unused-vars.
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$', caughtErrorsIgnorePattern: '^_' }],
    },
  },
])
