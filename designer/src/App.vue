<template>
  <div style="display: flex; column-gap: 20px; margin: 0 100px">
    <div class="widget-area">
      <div class="widget-box">
        <span data-tag="el-form" data-type="layout">表单</span>
      </div>
      <div class="widget-box">
        <span data-tag="el-form-item" data-type="layout">表单域</span>
      </div>
      <div class="widget-box">
        <span data-tag="el-input" data-type="comp">输入框</span>
      </div>
      <div class="widget-box">
        <span data-tag="el-select" data-type="comp">选择器</span>
      </div>
      <div class="widget-box">
        <span data-tag="span" data-type="comp">文本</span>
      </div>
      <div class="widget-box">
        <span data-tag="el-row" data-type="layout">row</span>
      </div>
      <div class="widget-box">
        <span data-tag="el-col" data-type="comp">col</span>
      </div>
      <div class="widget-box">
        <span data-tag="Layout" data-type="layout">栅格</span>
      </div>
    </div>
    <el-tree
      ref="treeRef"
      node-key="id"
      :data="treeNode"
      :props="treeProps"
      draggable
      default-expand-all
    >
    </el-tree>
    <div class="drag-box drop-area" ref="dropRef">
    </div>
    <el-tabs style="flex:1">
      <el-tab-pane label="表单配置">
        <el-form @submit.prevent>
          <el-form-item label="label-width">
            <!-- <el-input v-model="widgetsStore.ElForm.labelWidth" @change="renderer" /> -->
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="表单域配置"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
})
</script>

<script lang="ts" setup>
import Sortable, { SortableEvent } from 'sortablejs'
import { onMounted, ref, nextTick, watch } from 'vue'
import { IDomTree, useDomTreeStore, useWidgetsStore } from './store'
import { useRender, useRenderDom } from './hooks/render'
import { v4 as uuidv4 }from 'uuid'
import { domToTree, isEmpty } from './util/tools'

const treeProps = ref({
  label: 'tag',
})

const treeNode = ref([])
const widgetsStore = useWidgetsStore();
const domTree = useDomTreeStore()
const dropRef = ref();
const treeRef = ref();

onMounted(() => {
  useRenderDom(dropRef.value, treeNode.value);
  bindDragBox()
})
watch(() => treeNode.value, (nodes) => {
  useRenderDom(dropRef.value, nodes);
  nextTick().then(() => {
    bindDragBox();
  })
}, { deep: true })
function handleNodeDrop() {
  useRenderDom(dropRef.value, treeNode.value);
}
function findWidget(toId: string, parent?: IDomTree): [IDomTree | null, IDomTree] {
  const list = parent? parent.children : domTree.domTree;
  for (let widget of list) {
    if (widget.id === toId) {
      return [parent || null, widget]
    }
    if (!isEmpty(widget.children)) {
      const res = findWidget(toId, widget)
      if (res.length > 0) {
        return res;
      }
    }
  }
  return [] as any
}
function insertWidget(node: IDomNode, toId?: string, nextId?: string | null) {
  if (nextId) {
    treeRef.value.insertBefore(node, nextId)
  } else {
    treeRef.value.append(node, toId)
  }
}
// function insertWidget(parent: IDomTree[] = domTree.domTree, widgetEl: HTMLElement) {
//   const nextEl = widgetEl.nextElementSibling as HTMLElement | null
//   const widget = widgetEl.dataset;
//   const widgetObj = {
//     id: widget.id!,
//     tag: widget.tag!,
//     children: [],
//   }
//   if (nextEl) {
//     const { id } = nextEl.dataset;
//     const insertIndex = parent.findIndex(item => item.id === id);
//     parent.splice(insertIndex, 0, widgetObj)
//   } else {
//     parent.push(widgetObj)
//   }
// }

function removeNode(nodeKey: string) {
  const removeNode = treeRef.value.getNode(nodeKey);
  treeRef.value.remove(nodeKey);
  return removeNode;
}

function switchWidget(originId: string, drop: SortableEvent) {
  const to = drop.to
  const toId = to.dataset.id
  const nextId = getWidgetId(drop.item.nextElementSibling as HTMLElement)

  const nodeRemoved = removeNode(originId);
  if (!nextId) {
    treeRef.value.append(nodeRemoved.data, toId)
  }
}
// function switchWidget(
//   origin: IDomTree[] = domTree.domTree,
//   // target: IDomTree[] = domTree.domTree,
//   event: SortableEvent,
//   toId: string
// ) {
//   const widgetEl = event.item;
//   const nextEl = widgetEl.nextElementSibling;

//   // debugger;
//   const originId = getWidgetId(widgetEl)

//   const originIndex = origin.findIndex(item => item.id === originId)
//   const obj = origin.splice(originIndex, 1);
//   if (!nextEl) {
//     const [parent, toWidget] = findWidget(toId)
//     const list = toId ? toWidget.children : parent?.children ?? domTree.domTree;
//     list.push(...obj)
//   } else {
//     const toId = getWidgetId(nextEl as HTMLElement)
//     const [toWidget] = findWidget(toId!)
//     const target = toWidget?.children ?? domTree.domTree;
//     const targetIndex = target.findIndex(item => item.id === toId);
//     target.splice(targetIndex, 0, ...obj);
//   }
//   // const targetIndex = (toId ? target : domTree.domTree).findIndex(item => item.id === toId)
//   // target.splice(targetIndex, 0, ...obj);
// }

function getWidgetId(el?: HTMLElement) {
  if (!el) {
    return null;
  }
  let id = el.dataset.id;
  if (!id) {
    id = (el.children[0] as HTMLElement).dataset.id;
  }
  return id;
}

const hasChange = ref(false)

function renderer() {
  useRender(dropRef.value)
}

function createDomNode(tag: keyof typeof widgetsStore.$state): IDomNode {
  const id = uuidv4();
  const config = widgetsStore.$state[tag];
  if (config.snippets) {
    return domToTree(config.snippets);
  }
  return {
    id,
    tag,
    attrs: config.attrs,
    snippets: config.snippets,
    childre: [],
  }
}

function bindDragBox() {
  const widgets = document.querySelectorAll('.widget-box');
  const boxs = document.querySelectorAll('.drag-box, .el-form-item__content');
  widgets.forEach(item => {
    Sortable.create(item as HTMLElement, {
      group: {
        name: 'group',
        pull: 'clone',
        put: false,
      },
      sort: false,
      onEnd(el) {
        console.log(el.to)
        // if (!hasChange.value) {
        //   return;
        // }
        // hasChange.value = false;

        let toId = el.to.dataset.id;
        if (!toId) {
          toId = el.to.parentElement?.dataset.id
        }
        const nodes = createDomNode(el.item.dataset.tag as any);
        const nextId = getWidgetId(el.item.nextElementSibling as HTMLElement)
        insertWidget(nodes, toId, nextId);
        el.item.dataset.id = nodes.id;
      },
      onChange() {
        hasChange.value = true;
      },
      onAdd(ev) {
        console.log('add', ev)
      }
    });
  })
  boxs.forEach(item => {
    Sortable.create(item as HTMLElement, {
      sort: false,
      draggable: '.draggable',
      group: {
        name: 'group'
      },
      onChange() {
        hasChange.value = true;
      },
      onEnd(ev) {
        if (!hasChange.value) {
          return;
        }
        hasChange.value = false;
        // const nextEl = ev.item.nextElementSibling || ev.to;
        let toId = ev.to.dataset.id;
        if (!toId) {
          toId = ev.to.parentElement?.dataset.id;
        }
        let originId = ev.item.dataset.id;
        if (!originId) {
          originId = (ev.item.children[0] as HTMLElement).dataset.id;
        }
        switchWidget(originId!, ev)
        // const [toPar] = findWidget(toId!)!;
        // const [originPar] = findWidget(originId!)!
        // switchWidget(originPar?.children, ev, toId!)
        // useRender(dropRef.value)
        // nextTick().then(() => {
        //   bindDragBox();
        // })
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.drop-area {
  padding: 10px;
  width: 1000px;
  min-height: 400px;
  border: 1px solid #d9d9d9;
}
</style>

<style lang="scss">
.form-wrap {
  min-height: 60px;
  border: 1px solid crimson;
}
.layout-col {
  min-height: 60px;
  border: 1px solid green;
  padding: 10px;
}
.layout-row {
  padding: 10px;
  min-height: 60px;
  border: 1px solid powderblue;
}
.sortable-ghost {
  overflow: hidden;
  background: #409EFF;
  padding: 0 !important; 
  min-height: 0px !important;
  height: 0;
  outline: 1px solid #1861d5!important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1000;
  * {
    display: none !important;
  }
}
</style>
