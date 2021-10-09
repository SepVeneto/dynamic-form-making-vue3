import { defineComponent, PropType } from "vue-demi";
import dynamicFormItem from './dynamic-form-item';

export default defineComponent({
  name: 'dynamic-form',
  props: {
    config: Object as PropType<Config>,
    modelValue: Object,
  },
  emits: ['update:modelValue'],
  components: {
    dynamicFormItem
  },
  setup(props, context) {
    return () => (
      <el-form {...props.config}>
        {props.config?.data.map(item => (
          <dynamic-form-item
            config={item} data={props.modelValue}
            {...{
              'onUpdate:modelValue': (val: string) => context.emit('update:modelValue', val)
            }}
          />
        ))}
      </el-form>
    )
  }
})