import { defineComponent, PropType, computed } from 'vue';
import dynamicFormItem from './dynamic-form-item';
import { extractObject } from './tools';

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
    const formProps = computed(() => {
      // return extractObject(props.config!, ['config', 'data'], 'exclude')
      return props.config!.config;
    })
    return () => (
      <el-form {...formProps.value} model={props.modelValue}>
        {props.config?.data.map(item => (
          <dynamic-form-item
            config={item} data={props.modelValue} v-slots={context.slots}
            {...{
              'onUpdate:modelValue': (val: string) => context.emit('update:modelValue', val)
            }}
          />
        ))}
      </el-form>
    )
  }
})