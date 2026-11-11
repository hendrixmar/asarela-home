import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative asset URLs, so the build works at a domain root and under a sub-path (GitHub Pages)
  plugins: [react()],
})
