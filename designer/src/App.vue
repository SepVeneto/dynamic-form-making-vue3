<script lang="tsx">
// This starter template is using Vue 3 <script setup> SFCs
import { ref, defineComponent, computed, watch, nextTick, onMounted } from "vue";
import type { App } from 'vue'
import draggable from 'vuedraggable'
import componentsDraggable from "./components/components-draggable";
import templateCode from './components/templateCode'
import {compile} from "./render";
import { useStore } from "./store";
import renderConfig from "./components/renderConfig";
// import dynamicForm from '../packages/dynamic-form/dynamic-form'
import generateCode from './components/generateCode'
import aceEditor from './ace-editor.vue'
import { useDragula } from "./hooks/dragula";
// import 'ace-builds'

// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
export default defineComponent({
  components: {
    draggable,
    componentsDraggable,
    templateCode,
    // dynamicForm,
    aceEditor,
  },
  setup() {
    const config = ref<Config>({
      data: [],
      config: {}
    })
    window.addEventListener('message', event => {
      const { action, data } = event.data;
      switch(action) {
        case 'config':
          config.value = JSON.parse(data)
          break;
      }
    })
    window.parent.postMessage({
      action: 'getConfig'
    }, '*')
    // config.value = JSON.parse(sessionStorage.getItem('config') ?? JSON.stringify(config.value))
    // const store = useStore();
    // watch(() => config.value, (config) => {
    //   store.commit('UPDATE_CONFIG', config)
    // }, { deep: true })
    // const data = {
    //   name: 'venento',
    // }
    const dropRef = ref();
    const leftRef = ref();
    onMounted(() => {
      useDragula(leftRef.value, dropRef.value);
    })
    const components = ref<Cell[]>([
      {label: '文本', prop: 'text', component: '<span>文本</span>' },
      {label: '输入框', prop: 'input', component: `<el-input />`},
      {label: '栅格', prop: 'layout', component: `<el-row>
      <el-col
        class="mask-wrap is-layout"
        style="background: #fff;"
      :span="12">
        </el-col>
        <el-col
          class="mask-wrap is-layout"
          style="background: #fff;"
          :span="12"
        >
        </el-col>
      </el-row>`}
    ])

    const code = computed(() => {
      return generateCode(config.value)
    })
    const fakeData = ref({})
    function onDragstart(e: DragEvent, cell: Cell) {
      e.dataTransfer?.setData('code',
        JSON.stringify({ origin: 'sidebar', cell: { ...cell, id: `${cell.prop}-${Date.now()}` } })
      )
    }
    function onDragover(e: DragEvent) {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move'
    }
    function onDrop(e: DragEvent) {
      e.preventDefault();
      if (!e.dataTransfer) {
        return;
      }
      const data = e.dataTransfer.getData('code');
      if (!data) {
        return;
      }
      const dataTransfer = JSON.parse(data!);
      if (dataTransfer.origin === 'sidebar') {
        const code = dataTransfer.cell;
        config.value.data.push(code);
      } else if (dataTransfer.origin === 'dropArea') {
        const origin = dataTransfer.cell;
        const originId = origin.id!;
        const target = e.target as HTMLElement;
        const targetId = target.dataset.id;
        const index = config.value.data.findIndex(item => item.id === targetId)
        const originIndex = config.value.data.findIndex(item => item.id === originId)
        config.value.data.splice(originIndex, 1);
        config.value.data.splice(index, 0, origin);
      }
      const el = dropRef.value;
      app.value?.unmount();
      app.value = compile(config.value.data)
      nextTick().then(() => {
        app.value?.mount(el)
      })
    }
    const app = ref<App>();
    function getId() {
      // const id = store.state.id;
      // store.commit('INCREASE_ID');
      // return id;
    }
    function handleClone(data: Cell) {
      if (data.prop === 'layout') {
        return {
          id: getId(),
          type: data.prop,
          prop: `${data.prop}-${Date.now()}`,
          elements: [{ col: 12, elements: [] }, { col: 12, elements: [] }]
        }
      }
      return {
        id: getId(),
        type: data.prop,
        label: data.label,
        prop: `${data.prop}-${Date.now()}`
      };
    }
    function handleDownload() {
      window.parent.postMessage({
        action: 'download',
        data: {
          code: code.value,
        }
      }, '*')
    }
    function handleBeauty() {
      aceRef.value.beauty();
    }
    function extractProp(config: RenderCell[]) {
      config.forEach(item => {
        const path = item.prop?.split('.') ?? [];
        if (path.length > 1) {

        }
      })
    }
    const fakeDataView = ref(false)
    function handleGenerateData() {
      fakeDataView.value = true 
    }
    const aceRef = ref();
    function handleConfirm() {
      const data = aceRef.value.getContent()
      fakeData.value = JSON.parse(data);
      console.log(fakeData.value)
      fakeDataView.value = false;
    }
    const jsonView = ref(false);
    const jsonConfig = ref('');
    function handleJsonConfirm() {
      config.value = JSON.parse(jsonConfig.value);
    }
    return () => (
      <div>
        <div ref={leftRef} class="left">
          {components.value.map(item => (
            // <div draggable onDragstart={(e) => onDragstart(e, item)}>{item.label}</div>
            <div data-comp={item.prop}>{item.label}</div>
          ))}
        </div>
        <div
          ref={dropRef}
          class="drop-area"
          // onDragover={onDragover}
          // onDrop={onDrop}
        ></div>
        {
          // <template-code config={config} style="flex: 1" />
        }
        <pre style="text-align: left;">{JSON.stringify(config.value, null, 2)}</pre>
      </div>
    )
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>

<style scoped>
.edit-area {
  min-width: 500px;
  min-height: 400px;
  border: 1px solid #ddd;
}
.item-config {
  position: sticky;
  top: 0;
}
.drop-area {
  width: 1000px;
  height: 400px;
  border: 1px solid #ccc;
}
</style>

<style lang="scss">
.mask {
  cursor: move;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}

</style>