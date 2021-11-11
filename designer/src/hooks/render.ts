import { createApp, defineComponent, nextTick } from 'vue'
import type { App } from 'vue'
import ElementPlus from 'element-plus'

let app: App | null

export function useRender(el: HTMLElement) {
  const comp= defineComponent({
    template: el.innerHTML,
  })
  if (app) {
    app.unmount();
    app = null
  }
  app = createApp(comp);
  app.use(ElementPlus)
  nextTick().then(() => {
    app!.mount(el)
  })
}