import { createApp } from 'vue'

export default function render(code: string) {
  const app = createApp({
    template: code
  })
  console.log('trigger')
  const root = document.createElement('div');
  const inst = app.mount(root);
  const dom = document.querySelector('#code-area');
  console.log(dom, app)
  dom && dom.appendChild(root)
}