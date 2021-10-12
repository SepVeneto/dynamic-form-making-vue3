import { defineComponent } from "vue";

export default defineComponent({
  props: {
    code: String,
  },
  setup(props) {
    return () => (
      <div innerHTML={props.code}></div>
    )
  }
})