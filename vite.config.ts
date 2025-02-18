/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: '<package-name>',
      entry: {
        main: './lib/index.ts',
        sum: './lib/sum/index.ts',
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
