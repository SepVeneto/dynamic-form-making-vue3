<script lang="tsx">
// This starter template is using Vue 3 <script setup> SFCs

import { ref, defineComponent, computed, watch } from "vue";
import draggable from 'vuedraggable'
import componentsDraggable from "./components/components-draggable";
import templateCode from './components/templateCode'
import render from "./render";
import { useStore } from "./store";
import renderConfig from "./components/renderConfig";
// import dynamicForm from '../packages/dynamic-form/dynamic-form'
import generateCode from './components/generateCode'
import aceEditor from './ace-editor.vue'
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
    const store = useStore();
    watch(() => config.value, (config) => {
      store.commit('UPDATE_CONFIG', config)
    }, { deep: true })
    const data = {
      name: 'venento',
    }
    const components = ref<Cell[]>([
      {label: '文本', prop: 'text', component: '<span>文本</span>' },
      {label: '输入框', prop: 'input', component: '<el-input />'},
      {label: '栅格', prop: 'layout'}
    ])
    const drag = ref(false)
    const elements = ({element}: any) => {
      return (<div>{element.label}</div>)
    }
    const codeView = ref(false);
    const code = computed(() => {
      return generateCode(config.value)
    })
    const fakeData = ref({})
    const preview = ref(false)
    function getId() {
      const id = store.state.id;
      store.commit('INCREASE_ID');
      return id;
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
      <>
        <header>
          <el-button type="text" onClick={() => codeView.value = true}>生成代码</el-button>
          <el-button type="text" onClick={() => jsonView.value = true}>导入配置</el-button>
          <el-button type="text" onClick={() => preview.value = true}>预览</el-button>
        </header>
        <el-row>
          <el-col span={4}>
            <draggable
              list={components.value}
              v-slots={{
                item: elements
              }}
              item-key="prop"
              sort={false}
              group={{name:'detail', pull: 'clone', put: false}}
              clone={(data: Cell) => handleClone(data)}
            />
          </el-col>
          <el-col span={14}>
          {
            <components-draggable
              class="edit-area"
              style="flex: 1"
              list={config.value.data}
              item-key="id"
              group={{name:'detail'}}
              data={data}
              ghost-class="detail-ghost"
            />
          }
          </el-col>
          <el-col span={6}>
          {
            <aside class="item-config">
              {renderConfig(store.state.current.type)?.(store.state.current)}
            </aside>
          }
          {
            // <template-code config={config} style="flex: 1" />
          }
          </el-col>
        </el-row>
        <footer>
          <dynamic-form config={config.value} />
        </footer>
        <pre style="text-align: left;">{JSON.stringify(config.value, null, 2)}</pre>
        <el-dialog v-model={codeView.value} destroy-on-close>
          <ace-editor v-model={code.value}/>
          <el-button type="text" onClick={handleDownload}>下载文件</el-button>
        </el-dialog>
        <el-dialog v-model={fakeDataView.value} destroy-on-close>
          <ace-editor ref={aceRef} type="json" modelValue={JSON.stringify(fakeData.value, null, 2)} />
          <el-button type="primary" onClick={handleConfirm}>确定</el-button>
        </el-dialog>
        <el-dialog v-model={jsonView.value} destroy-on-close>
          <ace-editor ref={aceRef} type="json" v-model={jsonConfig.value} />
          <el-button type="primary" onClick={handleJsonConfirm}>确定</el-button>
          <el-button type="primary" onClick={handleBeauty}>格式化</el-button>
        </el-dialog>
        <el-dialog v-model={preview.value}>
          <header>
            <el-button type="text" onClick={handleGenerateData}>导入数据</el-button>
          </header>
          <dynamic-form config={config.value} v-model={fakeData.value}/>
        </el-dialog>
      </>
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
</style>
