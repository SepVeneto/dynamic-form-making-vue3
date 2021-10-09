import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: 'template-code',
  props: {
    config: Object as PropType<Config>,
  },
  setup(props) {
    return () => (
      <div style="display: inline-block">
        <pre>{JSON.stringify(props.config, null, 2)}</pre>
      </div>
    )
  }
})