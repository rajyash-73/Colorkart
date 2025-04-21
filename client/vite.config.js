import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import themePlugin from '@replit/vite-plugin-shadcn-theme-json';
import path from 'path';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443
    },
    strictPort: true,
    allowedHosts: [
      'localhost',
      '0.0.0.0',
      '172.31.128.17',
      'a7c2b0e9-c4bd-4912-9db6-d8e76a014543-00-1m0y5conrqvbj.riker.replit.dev',
      '.replit.dev',
      '.repl.co'
    ],
  },
});