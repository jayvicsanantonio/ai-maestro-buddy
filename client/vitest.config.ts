import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'client',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
