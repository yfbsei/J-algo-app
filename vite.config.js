// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      sveltekit(),
      tailwindcss()
    ],
    
    // Production optimizations
    build: {
      // Enable terser minification with specific settings
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : []
        },
        format: {
          comments: false
        }
      },
      
      // Code splitting optimization
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': [
              // Chart libraries
              'chart.js'
            ],
            'svelte': [
              'svelte', 
              'svelte/internal'
            ],
            'utils': [
              './src/lib/utils/chartUtils.js',
              './src/lib/utils/chartInteraction.js',
              './src/lib/utils/chartHelpers.js'
            ]
          },
          // Reduce chunk size warnings threshold
          chunkSizeWarningLimit: 1000
        }
      },
      
      // Asset optimization
      assetsInlineLimit: 4096, // 4KB - Assets smaller than this will be inlined as base64
      cssCodeSplit: true, // Split CSS into chunks
      reportCompressedSize: false, // Disable compressed size reporting for better build performance
      
      // Enable target for modern browsers
      target: 'es2020'
    },
    
    // Optimization settings
    optimizeDeps: {
      include: [
        'chart.js/auto',
        'svelte-spa-router'
      ],
      exclude: [],
      esbuildOptions: {
        target: 'es2020'
      }
    },
    
    // Server settings based on mode
    server: {
      open: true,
      hmr: {
        overlay: true
      },
      // Use faster native networking in development
      fs: {
        strict: true
      }
    },
    
    // Specify the public path for different environments
    base: isProduction ? './' : '/',
    
    // Performance optimizations
    esbuild: {
      target: 'es2020',
      legalComments: 'none'
    },
    
    // EXPERIMENTAL: Turning on some performance features
    experimental: {
      // Enables Vite's build-time hydration analysis (helps optimize SSR)
      renderBuiltUrl: (filename, { hostType }) => {
        if (hostType === 'js') {
          return { runtime: `window.__vite_public_path + ${JSON.stringify(filename)}` };
        }
        return filename;
      }
    }
  };
});