/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: '@fcf/national-holiday-jp',
      entry: {
        main: './lib/index.ts',
      },
      fileName: (format, entryName) => {
        const fileName = entryName === 'main' ? 'index' : `${entryName}/index`;
        return format === 'es' ? `es/${fileName}.js` : `cjs/${fileName}.cjs`;
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.spec.ts'],
    },
  },
});
