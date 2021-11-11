import { createApp, compile as compiler, defineComponent } from 'vue'
import ElementPlus from 'element-plus'
import mask from '@/components/mask'

// export default function render(code: string) {
//   const app = createApp({
//     template: code
//   })
//   console.log('trigger')
//   const root = document.createElement('div');
//   const inst = app.mount(root);
//   const dom = document.querySelector('#code-area');
//   console.log(dom, app)
//   dom && dom.appendChild(root)
// }

// export function compile(code: string) {
//   // return compiler(code)
//   // const { descriptor } = parse(code)
//   return compileTemplate({
//     source: code,
//     filename: 'anysome.vue',
//     id: Date.now().toString()
//   })
//   // return compileScript(descriptor, { id: Date.now().toString() }).content;
// }
function maskWrap(cell: Cell) {
  return `
<el-form-item
  data-id="${cell.id}"
  class="draggable-area${cell.prop === 'layout' ? '' : ' mask'}"
  draggable="true"
  @dragstart='(e) => onStart(e, ${JSON.stringify(cell)})'
>
  <comp-mask mask :data='${JSON.stringify(cell)}'>${cell.component}</comp-mask>
</el-form-item>
`
}

export function compile(code: Cell[]) {
  const comp = defineComponent({
    template: `<el-form>${code.map(item => maskWrap(item)).join('')}</el-form>`,
    setup() {
      function onStart(e: DragEvent, cell: Cell) {
        e.dataTransfer?.setData('code', JSON.stringify({ origin: 'dropArea', cell }))
      }
      return {
        onStart,
      }
    }
  })
  const app = createApp(comp);
  app.use(ElementPlus)
  app.component(mask.name, mask)
  return app;
}