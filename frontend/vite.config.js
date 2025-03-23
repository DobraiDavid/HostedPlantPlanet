import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/user/, '/user'),
      },
    },
  },
});
