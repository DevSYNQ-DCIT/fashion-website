import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { componentTagger } from 'lovable-tagger';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    define: {
      'process.env': env,
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
    },
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
      // Handle SPA fallback for client-side routing
      historyApiFallback: true,
      // Enable CORS for development
      cors: true,
      // Configure proxy if needed for API requests
      proxy: {}
    },
    // Base public path when served in production
    base: '/',
    // Configure how the dev server should serve files
    preview: {
      port: 8080,
      strictPort: true,
      // Handle SPA fallback for client-side routing in preview mode
      historyApiFallback: true
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        tsDecorators: true,
        devTarget: 'es2022',
      }),
      mode === "development" && componentTagger(),
      isProduction && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
      isProduction && viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      isProduction && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      splitVendorChunkPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Fashion Website',
          short_name: 'Fashion',
          description: 'Modern fashion e-commerce platform',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      cssMinify: true,
      sourcemap: true,
      // Asset handling and optimization
      assetsInlineLimit: 4096,
      // Code splitting configuration
      cssCodeSplit: true,
      // Output directory for the build
      outDir: 'dist',
      // Generate manifest for better caching
      manifest: true,
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Group React and React DOM
              if (id.includes('react-dom') || id.includes('react/jsx-runtime')) {
                return 'vendor-react';
              }
              // Group Radix UI components
              if (id.includes('@radix-ui')) {
                const match = id.match(/@radix-ui\/([^/]+)/);
                return match ? `radix-${match[1]}` : 'radix-vendor';
              }
              // Group UI libraries
              if (id.includes('@hookform') || id.includes('react-hook-form')) {
                return 'vendor-forms';
              }
              // Group utility libraries
              if (id.includes('date-fns') || id.includes('lodash') || id.includes('zod')) {
                return 'vendor-utils';
              }
              // Group state management
              if (id.includes('@tanstack') || id.includes('zustand')) {
                return 'vendor-state';
              }
              // Group all other node_modules
              return 'vendor';
            }
            // Group async chunks
            if (id.includes('src/pages/') || id.includes('src/routes/')) {
              const match = id.match(/src\/(?:pages|routes)\/([^/]+)/);
              return match ? `page-${match[1].toLowerCase()}` : 'pages';
            }
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
      },
      reportCompressedSize: false,
      modulePreload: {
        polyfill: false,
      },
    },
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isProduction 
          ? '[hash:base64:8]' 
          : '[name]__[local]__[hash:base64:5]',
      },
    },
    optimizeDeps: {
      include: ['@emotion/styled'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
  };
});