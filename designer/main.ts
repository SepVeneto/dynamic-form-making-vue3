import { createApp } from 'vue'
import VueStore, { key } from './store'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import compMask from './components/mask'
import DynamicForm from 'dynamic-form'
createApp(App)
  .use(ElementPlus)
  .use(VueStore, key)
  .use(DynamicForm)
  .component(compMask.name, compMask)
  .mount('#app')
