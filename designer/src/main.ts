import { createApp } from 'vue'
// import VueStore, { key } from './store'
import App from './App.vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/theme-chalk/index.css'
import compMask from './components/mask'
// import DynamicForm from 'dynamic-form'
// import Basic from 'basic-components'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
