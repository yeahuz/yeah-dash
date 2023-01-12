import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/

export default defineConfig(() => {
  return {
    plugins: [preact()],
    resolve: {
      alias: {
        react: 'preact/compat'
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001"
        }
      }
    }
  };
});
