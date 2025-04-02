import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	// Production optimizations
	build: {
		// Enable minification
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		},
		// No need for manual chunks as we've removed chart.js
		// Reduce chunk size warnings threshold
		chunkSizeWarningLimit: 1000
	},
	// Optimize server during development
	server: {
		open: true,
		hmr: {
			overlay: true
		}
	}
});