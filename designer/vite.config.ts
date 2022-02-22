import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import pluginMock from 'vite-plugin-mock'
import pluginMock from '../packages/plugin-mock'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/dynamic-form-making-vue3/',
  // base: '/__designer/',
  server: {
    proxy: {
      '/api' : {
        target: 'http://localhost:7777',
        changeOrigin: true,
      }
    },
    fs: {
      strict: false,
    }
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [vue({
    template: {
        compilerOptions: {
          // 将所有包含短横线的标签作为自定义元素处理
          isCustomElement: tag => {
            return tag.startsWith('bc-') || tag === 'drag-wrap'
          }
        }
      }
    }
  ), vueJsx({
    isCustomElement: tag => {
      return tag.startsWith('bc-') || tag === 'drag-wrap'
    }
  }), pluginMock()]
})
