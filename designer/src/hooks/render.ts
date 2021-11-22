import { createApp, defineComponent, nextTick, ref } from 'vue'
import type { App } from 'vue'
import ElementPlus from 'element-plus'
import { IDomTree, useDomTreeStore, useWidgetsStore } from '@/store'
import { domToTree } from '@/util/tools'

let app: App | null
function renderDomTree(domTree: IDomTree[], widgets: ReturnType<typeof useWidgetsStore>) {
  let res = '';
  Object.entries(domTree).forEach(([, widget]) => {
    const attrs = widgets ? widgets[widget.tag as keyof typeof widgets.$state].attrs : (widget.attributes ?? {});
    const element = `<${widget.tag} data-id="${widget.id}" v-bind='${JSON.stringify(attrs ?? {})}'></${widget.tag}>`;
    res += widget.children ?
      element.replace(/><\//, `>${renderDomTree(widget.children, widgets)}</`) :
      element
    // res += attrs?.modelValue ?
    //   `<${widget.tag} data-id="${widget.id}" v-bind='${JSON.stringify(attrs ?? {})}' v-model='formData.${attrs.modelValue}'>` :
    //   `<${widget.tag} data-id="${widget.id}" v-bind='${JSON.stringify(attrs ?? {})}'>`
    // if (widget.tag === 'span') {
    //   res += '示例文本'
    // }
    // if (widget.children) {
    //   res += renderDomTree(widget.children, widgets)
    // }
    // res += `</${widget.tag}>`
  })
  return res;
}
export function useRender(el: HTMLElement) {
  const domTree = useDomTreeStore()
  const widgetsStore = useWidgetsStore();
  const template = renderDomTree(domTree.domTree, widgetsStore);
  
  const comp= defineComponent({
    template,
    setup: () => {
      const formData = ref({});
      return {
        formData,
      }
    }
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

function renderDom(nodeList: any[]): any {
  if (!nodeList || (nodeList?.length === 0)) {
    return '';
  }
  return nodeList.map(item => {
    if (item.snippets) {
      const nodes = domToTree(item.snippets)
      return renderDom([nodes])
    }
    return `<${item.tag} data-id="${item.id}" v-bind='${JSON.stringify(item.attrs)}'>${item.textContent ?? ''}${renderDom(item.children)}</${item.tag}>`
  }).join('')
}
export function useRenderDom(el: HTMLElement, tree: any) {
  const template = renderDom(tree);
  if (!template) {
    return;
  }
  const comp= defineComponent({
    template,
    setup: () => {
      const formData = ref({});
      return {
        formData,
      }
    }
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