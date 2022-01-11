<template>
  <div>
    <el-button type="text" @click="handlePreview">预览</el-button>
    <el-button type="text" @click="handleShowCode">代码</el-button>
  </div>
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
      <div class="widget-box">
        <span data-tag="form-item" data-type="comp">form-item</span>
      </div>
    </div>
    <el-tree
      ref="treeRef"
      node-key="id"
      :data="treeNode"
      :props="treeProps"
      highlight-current
      draggable
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
    </el-tree>
    <div class="drag-box drop-area" ref="dropRef" @click="handleClick"></div>
    <el-tabs style="flex: 1">
      <!-- <el-tab-pane label="表单配置">
        <el-form @submit.prevent>
          <el-form-item label="label-width">
          </el-form-item>
        </el-form>
      </el-tab-pane> -->
      <el-tab-pane label="配置">
        <render-config :type="nodeConfig.tag" v-model="nodeConfig.attrs" />
        <!-- <el-form>
          <el-form-item label="label">
            <el-input v-model="nodeConfig.attrs.label" />
          </el-form-item>
        </el-form> -->
      </el-tab-pane>
    </el-tabs>
  </div>
  <pre><code>{{text}}</code></pre>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
});
</script>

<script lang="ts" setup>
// import prettyhtml from '@starptech/prettyhtml'
import prettier from 'prettier/standalone';
import parseVue from 'prettier/parser-html';
// import beautify from "js-beautify";
import RenderConfig from './renderConfig';
import Sortable, { SortableEvent } from 'sortablejs';
import { onMounted, ref, nextTick, watch, shallowRef, reactive } from 'vue';
import { IDomTree, useDomTreeStore, useWidgetsStore } from './store';
import { useRender, useRenderDom } from './hooks/render';
import { v4 as uuidv4 } from 'uuid';
import { domToTree, isEmpty } from './util/tools';
import configure from './config.json'
import { useFetch } from './hooks/hooks';

const treeProps = ref({
  label: 'tag',
});

const treeNode = ref([]);
const widgetsStore = useWidgetsStore();
const domTree = useDomTreeStore();
const dropRef = ref();
const treeRef = ref();
const codeCont = ref();

const res = reactive(useFetch('/mock-api/el-form').get().json());
setTimeout(() => {
  console.log(res.data.tag)
  widgetsStore.repo[res.data.tag] = res.data;
  console.log(widgetsStore.repo)
}, 1000)
onMounted(() => {
  useRenderDom(dropRef.value, treeNode.value);
  domTree.treeRef = treeRef.value;
  bindDragBox();
});
watch(
  () => treeNode.value,
  (nodes) => {
    useRenderDom(dropRef.value, nodes);
    nextTick().then(() => {
      bindDragBox();
    });
  },
  { deep: true }
);

const nodeConfig = ref({
  tag: '',
  attrs: { class: '', label: '' },
});
const text = ref();
function handleShowCode() {
  text.value = prettier.format(`<template>${codeCont.value}</template>`, {
    htmlWhitespaceSensitivity: 'ignore',
    parser: 'vue',
    plugins: [parseVue],
  });
}
function combineCode(nodeList: any[]) {
  let res = '';
  if (!nodeList || nodeList.length === 0) {
    return res;
  }
  nodeList.forEach((item) => {
    res += `<${item.tag}${combineAttrs(item.attrs)}>${combineCode(
      item.children
    )}</${item.tag}>`;
  });
  return res;
}
function combineAttrs(attrs: Record<string, any>) {
  let res = '';
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'modelValue') {
      res += ` v-model="${value}"`;
      return;
    }
    res += ` ${key}="${value}"`;
  });
  return res;
}
function handlePreview() {
  const code = combineCode(treeNode.value);
  codeCont.value = code;
  useRender(dropRef.value, code);
}
function handleNodeClick(data: any) {
  selectWidget(data.id);
}
function handleClick(ev: MouseEvent) {
  const pathList = ev.composedPath();
  const node = pathList.find(el => {
    if ((el as HTMLElement).classList.contains('drop-area')) {
      return true;
    }
    if ((el as HTMLElement).dataset.skip) {
      return false;
    }
    return !!(el as HTMLElement).dataset.id
  })
  const nodeId = (node as HTMLElement).dataset.id
  if (nodeId) {
    treeRef.value.setCurrentKey(nodeId);
    selectWidget(nodeId)
  }
}
function selectWidget(id: string) {
  nodeConfig.value = treeRef.value.getNode(id).data
  domTree.active = id;
}
function handleNodeDrop() {
  useRenderDom(dropRef.value, treeNode.value);
}
function findWidget(
  toId: string,
  parent?: IDomTree
): [IDomTree | null, IDomTree] {
  const list = parent ? parent.children : domTree.domTree;
  for (let widget of list) {
    if (widget.id === toId) {
      return [parent || null, widget];
    }
    if (!isEmpty(widget.children)) {
      const res = findWidget(toId, widget);
      if (res.length > 0) {
        return res;
      }
    }
  }
  return [] as any;
}
function insertWidget(node: IDomNode, toId?: string, nextId?: string | null) {
  if (nextId) {
    treeRef.value.insertBefore(node, nextId);
  } else {
    treeRef.value.append(node, toId);
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
  const to = drop.to;
  const toId = to.dataset.id;
  const nextId = getWidgetId(drop.item.nextElementSibling as HTMLElement);

  const nodeRemoved = removeNode(originId);
  if (!nextId) {
    treeRef.value.append(nodeRemoved.data, toId);
  } else {
    treeRef.value.insertBefore(nodeRemoved.data, nextId)
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

function getToId(el?: HTMLElement): string | undefined {
  if (!el) {
    return '';
  }
  const toId = el.dataset.id;
  if (!toId && el.parentElement) {
    return getToId(el.parentElement);
  }
  return toId;
}
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

const hasChange = ref(false);

function createDomNode(tag: keyof typeof widgetsStore.repo): IDomNode {
  const id = uuidv4();
  const config = widgetsStore.repo[tag];
  if (config.snippets) {
    return domToTree(config.snippets);
  }
  return {
    id,
    tag,
    code: config.code,
    skip: (config as any).skip,
    type: (config as any).type,
    style: (config as any).style,
    attrs: config.attrs,
    snippets: config.snippets,
    children: [],
  };
}

function bindDragBox() {
  const widgets = document.querySelectorAll('.widget-box');
  const boxs = document.querySelectorAll(
    '.drag-box, .el-row, .el-form-item__content, .el-form, .el-col'
  );
  widgets.forEach((item) => {
    Sortable.create(item as HTMLElement, {
      group: {
        name: 'group',
        pull: 'clone',
        put: false,
      },
      sort: false,
      onEnd(el) {
        let toId = getToId(el.to);
        const nodes = createDomNode(el.item.dataset.tag as any);
        const nextId = getWidgetId(el.item.nextElementSibling as HTMLElement);
        insertWidget(nodes, toId, nextId);
        el.item.dataset.id = nodes.id;
      },
      onChange() {
        hasChange.value = true;
      },
      onAdd(ev) {
        console.log('add', ev);
      },
    });
  });
  boxs.forEach((item) => {
    Sortable.create(item as HTMLElement, {
      handle: '.handle',
      sort: false,
      draggable: '.draggable',
      group: {
        name: 'group',
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
        switchWidget(originId!, ev);
        // const [toPar] = findWidget(toId!)!;
        // const [originPar] = findWidget(originId!)!
        // switchWidget(originPar?.children, ev, toId!)
        // useRender(dropRef.value)
        // nextTick().then(() => {
        //   bindDragBox();
        // })
      },
    });
  });
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
.sortable-ghost {
  overflow: hidden;
  background: #409eff;
  padding: 0 !important;
  min-height: 0px !important;
  height: 0;
  outline: 1px solid #1861d5 !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1000;
  * {
    display: none !important;
  }
}
.draggable {
  position: relative;
  padding: 10px;
  &.layout-wrap {
    background: rgba(253, 246, 236, 0.3);
    border: 1px dashed #d5c0c0;
    min-height: 60px;
  }
  &.comp-wrap {
    background: rgba(236, 245, 255, 0.3);
    border: 1px dashed #409eff;
  }
}
.handle {
  z-index: 2;
  display: none;
  background-image: url('@/assets/move.svg');
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  cursor: move;
  position: absolute;
  top: 0;
  left: 0;
}
.draggable > .operate {
  cursor: pointer;
  z-index: 2;
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  .icon:not(:last-child) {
    margin-right: 5px;
  }
}
.draggable.is-active {
  &.layout-wrap {
    border: 3px solid #d5c0c0;
  }
  &.comp-wrap {
    border: 3px solid #409eff;
  }
  > .handle {
    display: inline-block;
  }
  > .operate {
    display: inline-block;
  }
}
</style>
