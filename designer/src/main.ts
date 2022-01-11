import { createApp, Plugin } from 'vue'
// import VueStore, { key } from './store'
import App from './App.vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/theme-chalk/index.css'
import compMask from './components/mask'
// import DynamicForm from 'dynamic-form'
import Basic from 'basic-components'
// import ElementPlus from 'element-plus'
// import 'element-plus/theme-chalk/index.css'
import Pinia from '@/store/index'
const app = createApp(App)
app.use(Pinia).use(Basic as any as Plugin)
app.mount('#app')

// const wss = new WebSocket('ws://localhost:2999')
// wss.onopen = (e) => {
//   console.log('ws open')
// }
// wss.onmessage = (e) => {
//   const {type, data } = e.data && JSON.parse(e.data)
//   if (type === 'init') {
//     const doms = data.map((item: string) => {
//       const script = document.createElement('script');
//       script.type = 'module';
//       script.src = 'http://localhost:3000' + item
//       return script;
//     })
//   }
// }
