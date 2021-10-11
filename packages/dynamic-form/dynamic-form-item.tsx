import { defineComponent, PropType, toRefs } from "vue";

export default defineComponent({
  name: 'dynamic-form-item',
  props: {
    config: {
      type: Object as PropType<RenderCell>,
      required: true,
    },
    data: {
      type: Object,
    }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const { config } = toRefs(props);
    function updateModelValue(val: string, key: string) {
      context.emit('update:modelValue', { ...props.data, [key]: val })
    }
    console.log(config.value)
    return () => {
      const type = config.value.type;
      if (type === 'layout') {
        console.log(config)
        return (
          <el-row>
            {config.value.elements?.map(item => (
              <el-col span={item.col}>
                {item.elements?.map(each=> (<dynamic-form-item config={each} />))}
              </el-col>
            ))}
          </el-row>
        )
      } else if (config.value.type === 'text') {
        return <el-form-item {...config.value} >
          <span>{props.data?.[config.value.prop as string]}</span>
        </el-form-item>
      } else if (config.value.type === 'input') {
        return (
          <el-form-item {...config.value}>
            <el-input
              model-value={props.data?.[config.value.prop as string]}
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