import { createApp, defineComponent, nextTick, ref, watch } from 'vue'
import type { App } from 'vue'
import ElementPlus from 'element-plus'
import { Delete, CopyDocument } from '@element-plus/icons'
import { IDomTree, useDomTreeStore, useWidgetsStore } from '@/store'
import { domToTree } from '@/util/tools'
import Pinia from '@/store/index'
import { v4 as uuidv4 } from 'uuid';

let app: App | null
function renderDomTree(domTree: IDomTree[], widgets: ReturnType<typeof useWidgetsStore>) {
  let res = '';
  Object.entries(domTree).forEach(([, widget]) => {
    let attrs = widgets ? widgets[widget.tag as keyof typeof widgets.$state].attrs : (widget.attributes ?? {});
    console.log(attrs, JSON.stringify(attrs ?? {}))
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
export function useRender(el: HTMLElement, template: string) {
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
    let classes = item.type === 'component' ? ['draggable', 'comp-wrap'] : ['drag-box', 'draggable', 'layout-wrap'];

    const attrMap = Object.entries<string>(item.attrs).map(([key, val]) => {
      if (key.includes('v-model')) {
        const [, prop] = key.split(':')
        const propName = prop ?? 'modelValue'
        return [[propName, val], [`'onUpdate:${propName}'`, `(val) => ${val} = val`]]
      } else if (key.startsWith(':')) {
        return [key.slice(1), val]
      }
      return [key, `'${val}'`]
    })
    let attrs = Object.fromEntries(attrMap.flatMap<any>((item: string[]| string[][]) => {
      if (item.some((each: string | string[]) => Array.isArray(each))) {
        return item
      } else {
        return [item]
      }
    }))

    attrs = JSON.stringify(attrs).replaceAll('"', '') as any
    console.log(attrs)

    // classes = classes.map(item => `${item}`);
    return item.skip ?
    `<${item.tag} class="${
      classes.join(' ')
    }" style="${
      item.style
    }" data-id="${item.id}" data-skip="${item.skip}" v-bind="${
      attrs
    }">${item.textContent ?? ''}${renderDom(item.children)}</${item.tag}>` :
    wrapDom(`<${item.tag} v-bind="${attrs}">${item.textContent ?? ''}${renderDom(item.children)}</${item.tag}>`, item)
  }).join('')
}
function wrapDom(node: string, config: IDomNode) {
  let classes = config.type === 'component' ? ['draggable', 'comp-wrap'] : ['drag-box', 'draggable', 'layout-wrap'];
  classes = classes.map(item => `'${item}'`);
  classes.push(`{'is-active': domTree.active === '${config.id}'}`)
  const code = `<div :class="[${
    classes.join(',')
  }]" data-id="${
    config.id
  }" style="${config.style ?? ''}">
  <i class="handle"></i>
  <div class="operate">
    <el-icon class="icon" :size="20" @click.stop="handleCopy('${config.id}')"><copy-document /></el-icon>
    <el-icon class="icon" :size="20" @click.stop="handleDelete('${config.id}')"><delete /></el-icon>
  </div>${node}
  </div>`
  return code;
}
export function useRenderDom(el: HTMLElement, tree: any) {
  const template = renderDom(tree);
  if (!template) {
    return;
  }
  const comp= defineComponent({
    template,
    components: {
      Delete,
      CopyDocument,
    },
    setup: () => {
      const domTree = useDomTreeStore()
      const formData = ref({});
      function copyWidget(config: IDomNode) {
        config.id = uuidv4();
        config.children.forEach(item => {
          copyWidget(item);
        })
      }
      function handleCopy(id: string) {
        const node = domTree.treeRef.getNode(id);
        const parentId = node.parent?.data.id
        const cloneNode = JSON.parse(JSON.stringify(node.data));
        copyWidget(cloneNode)
        domTree.treeRef.append(cloneNode, parentId);
      }
      function handleDelete(id: string) {
        domTree.treeRef.remove(id)
        // console.log(domTree, id)
      }
      return {
        domTree,
        formData,
        handleCopy,
        handleDelete,
      }
    }
  })
  if (app) {
    app.unmount();
    app = null
  }
  app = createApp(comp);
  app.component(tree[0].tag, tree[0].code)
  app.use(ElementPlus).use(Pinia)
  nextTick().then(() => {
    app!.mount(el)
  })
}