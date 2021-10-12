import { computed, defineComponent, PropType, toRefs } from "vue";
import { getValue, setValue } from './tools';

export default defineComponent({
  name: 'dynamic-form-item',
  props: {
    config: {
      type: Object as PropType<RenderCell>,
      required: true,
    },
    data: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const { config } = toRefs(props);
    function updateModelValue(val: any, key: string) {
      const data = { ...props.data };
      setValue(data, key, val);
      context.emit('update:modelValue', data)
      // context.emit('update:modelValue', { ...props.data, [key]: val })
    }
    const value = computed(() => {
      return getValue(props.data, config.value.prop as string)
    })
    return () => {
      const type = config.value.type;
      if (type === 'layout') {
        return (
          <el-row>
            {config.value.elements?.map(item => (
              <el-col span={item.col}>
                {item.elements?.map(each=> (
                  <dynamic-form-item
                    config={each}
                    data={props.data}
                    {...{
                      'onUpdate:modelValue': (val: string) => context.emit('update:modelValue', val)
                    }}
                />))}
              </el-col>
            ))}
          </el-row>
        )
      } else if (config.value.type === 'text') {
        return <el-form-item {...config.value} >
          <span>{value.value}</span>
          {/* <span>{props.data?.[config.value.prop as string]}</span> */}
        </el-form-item>
      } else if (config.value.type === 'input') {
        return (
          <el-form-item {...config.value}>
            <el-input
              model-value={value.value}
              {...{
                'onUpdate:modelValue': (val: string) => updateModelValue(val, config.value.prop as string)
              }}
            />
            {/* <el-input v-model={} /> */}
          </el-form-item>
        )
      }
    }
  }
})