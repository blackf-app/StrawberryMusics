import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 9'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.promise',
        'es.array.iterator',
        'es.object.assign',
        'es.string.includes',
      ],
    }),
  ],
  build: {
    target: ['es2015', 'safari11'],
    cssTarget: ['safari11'],
    // Ensure compatibility with older browsers
    minify: 'terser',
    terserOptions: {
      safari10: true,
    },
  },
  // Optimize dependencies for older browsers
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015',
    },
  },
})
