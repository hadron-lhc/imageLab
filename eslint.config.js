import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const engineBoundary = {
  files: ['src/engine/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['react', 'react-dom', 'react/*', 'react-dom/*'],
            message: 'The image engine must stay independent from React.',
          },
          {
            group: ['**/ui/**', '../ui/*', '../../ui/*', '../../../ui/*'],
            message: 'The image engine must stay independent from the UI layer.',
          },
        ],
      },
    ],
  },
};

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules', 'benchmark/dataset']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  engineBoundary,
]);
