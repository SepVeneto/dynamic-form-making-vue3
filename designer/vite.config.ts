import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/dynamic-form-making-vue3/',
  server: {
    fs: {
      strict: true,
    }
  },
  plugins: [vue(), vueJsx()]
})
