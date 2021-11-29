import { defineStore, createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export interface IDomTree {
  id: string,
  tag: string,
  attributes?: Record<string, any>,
  children: IDomTree[],
}

export const useWidgetsStore = defineStore('widgets', {
  state: () => ({
    'el-input': {
      type: 'component',
      snippets: ``,
      attrs: {},
    },
    'el-form': {
      snippets: '',
      type: 'layout',
      attrs: {}
    },
    'el-form-item': {
      snippets: '',
      type: 'layout',
      style: 'background: #fff',
      attrs: {
        label: '示例文本',
      }
    },
    'el-select': {
      type: 'component',
      attrs: {},
      snippets: '',
    },
    span: {
      type: 'component',
      snippets: '<span>示例文本</span>',
      attrs: {}
    },
    'el-col': {
      type: 'layout',
      style: 'background: #fff',
      skip: true,
      snippets: '',
      attrs: {
        span: 12
      }
    },
    'el-row': {
      type: 'layout',
      snippets: '',
      attrs: {}
    },
    Layout: {
      attrs: {},
      snippets: `<el-row><el-col></el-col><el-col /></el-row>`
    }
  })
})

export const useDomTreeStore = defineStore('domTree', {
  state: (): { active: string, domTree: IDomTree[], treeRef: any } => ({
    active: '',
    treeRef: '',
    domTree: []
  }),
})
