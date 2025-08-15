import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			// Enable automatic JSX runtime
			jsxRuntime: 'automatic',
		}),
	],
	server: {
		port: 3000,
		open: true,
	},
	build: {
		outDir: 'dist',
		sourcemap: false,
		// Increase chunk size warning limit
		chunkSizeWarningLimit: 1000,
	},
	// Define environment variables prefix
	envPrefix: 'VITE_',
});
