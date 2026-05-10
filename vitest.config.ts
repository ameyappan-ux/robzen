import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['lib/__tests__/**/*.test.ts', 'app/**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.claude', '.next'],
  },
})
