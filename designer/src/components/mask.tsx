import { defineComponent, ref, PropType, computed } from "vue";
import {
  DocumentCopy as IconCopy,
  Delete as IconDelete
} from '@element-plus/icons'
// import { key, useStore } from "../store";
import './mask.scss'

export default defineComponent({
  name: 'comp-mask',
  components: {
    IconDelete,
    IconCopy,
  },
  props: {
    mask: Boolean,
    data: Object as PropType<Cell>,
  },
  setup(props, context) {
    const active = ref(false)
    // const store = useStore();
    function handleDelete() {
      // store.commit('DELETE_CONFIG', props.data)
    }
    function handleCopy() {
      // store.commit('COPY_CONFIG', props.data)
    }
    function handleSelect(e: MouseEvent) {
      e.stopPropagation();
      // store.commit('UPDATE_SELECT', props.data)
    }
    // const selected = computed(() => {
    //   return store.state.current.prop === props.data?.prop;
    // })
    const isLayout = computed(() => {
      return ['layout'].includes(props.data?.prop as string)
    })
    return () => (
      <div
        class={[
          "mask-wrap",
          // {'is-selected': selected.value},
          {'is-layout': isLayout.value}
        ]}
        onClick={handleSelect}
      >
        {/* <div class={{"mask": props.mask}}> */}
        {context.slots.default?.()}
        {/* </div> */}
        {/* <div class="operate move"><span>移动</span></div> */}
        <div class="operate more">
          <el-icon class="icon" onClick={handleDelete}>
            <icon-delete />
          </el-icon>
          <el-icon class="icon" onClick={handleCopy}>
            <icon-copy />
          </el-icon>
        </div>
        {/* <div class="mask"></div> */}
      </div>

  )
  }
})