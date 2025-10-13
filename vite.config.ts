import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'a369ad02-8c68-4f1f-a515-721045550725-00-2mde6dil6wks.pike.replit.dev'
    ]
  }
})
