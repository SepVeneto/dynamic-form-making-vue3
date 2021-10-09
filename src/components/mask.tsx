import { defineComponent, ref, PropType, computed } from "vue";
import { key, useStore } from "../store";
import './mask.scss'

export default defineComponent({
  name: 'comp-mask',
  props: {
    mask: Boolean,
    data: Object as PropType<RenderCell>,
  },
  setup(props, context) {
    const active = ref(false)
    const store = useStore();
    function handleDelete() {
      store.commit('DELETE_CONFIG', props.data)
    }
    function handleCopy() {
      console.log(props.data)
      store.commit('COPY_CONFIG', props.data)
    }
    function handleSelect(e: MouseEvent) {
      e.stopPropagation();
      store.commit('UPDATE_SELECT', props.data)
    }
    const selected = computed(() => {
      return store.state.current.prop === props.data?.prop;
    })
    return () => (
      <div class={["mask-wrap", {'is-selected': selected.value}]} onClick={handleSelect}>
        <div class={{"mask": props.mask}}>{context.slots.default?.()}</div>
        {/* <div class="operate move"><span>移动</span></div> */}
        <div class="operate more">
          <span onClick={handleDelete}>删除</span>
          <span onClick={handleCopy}>复制</span>
        </div>
        {/* <div class="mask"></div> */}
      </div>

  )
  }
})