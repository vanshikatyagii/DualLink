import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Force JSX parsing for .js files
export default defineConfig({
  plugins: [
    react({
      include: /\.(js|jsx)$/, // handle JSX in .js too
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/, // transform all JS/JSX files in src
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // 👈 tell dependency pre-bundler to treat .js as JSX too
      },
    },
  },
});
