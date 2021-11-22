import { defineStore } from "pinia";

export interface IDomTree {
  id: string,
  tag: string,
  attributes?: Record<string, any>,
  children: IDomTree[],
}

export const useWidgetsStore = defineStore('widgets', {
  state: () => ({
    'el-input': {
      snippets: `<el-input />`,
      attrs: {},
    },
    'el-form': {
      snippets: '',
      attrs: {
        class: 'form-wrap drag-box draggable',
        style: 'padding: 10px'
      }
    },
    'el-form-item': {
      snippets: '',
      attrs: {
        class: 'form-wrap drag-box draggable',
        style: 'padding: 10px; border-color: blue',
        label: '示例文本'
      }
    },
    'el-select': { attrs: {}, snippets: '', },
    span: {
      snippets: '<span>示例文本</span>',
      attrs: {
        class: 'draggable',
      }
    },
    'el-col': {
      snippets: '',
      attrs: {
        class: 'drag-box layout-col',
        span: 12
      }
    },
    'el-row': {
      snippets: '',
      attrs: {
        class: 'draggable layout-row'
      }
    },
    Layout: {
      attrs: {},
      snippets: `<el-row><el-col></el-col></el-row>`
    }
  })
})

export const useDomTreeStore = defineStore('domTree', {
  state: (): { domTree: IDomTree[] } => ({
    domTree: []
  }),
})
