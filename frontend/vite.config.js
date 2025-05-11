import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/user': {
        target: 'https://plantplanet.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/user/, '/user'),
      },
    },
  },
});
