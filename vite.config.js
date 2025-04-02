import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
 
    // Optimize performance
    server: {
        hmr: true,
      },
      
      // Optimize CSS
      css: {
        devSourcemap: true,
      },
      
      // Optimize build
      build: {
        cssMinify: true,
        cssCodeSplit: false,
      },
      
      // Ensure static assets are processed correctly
      publicDir: 'public',
})