import { defineComponent, PropType } from "vue-demi";

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
    const config = props.config;
    function updateModelValue(val: string, key: string) {
      context.emit('update:modelValue', { ...props.data, [key]: val })
    }
    return () => {
      const type = config?.type;
      if (type === 'layout') {
        console.log(config)
        return (
          <el-row>
            {config.elements?.map(item => (
              <el-col span={item.col}>
                {item.elements?.map(each=> (<dynamic-form-item config={each} />))}
              </el-col>
            ))}
          </el-row>
        )
      } else if (config.type === 'text') {
        return <el-form-item {...config} >
          <span>{props.data?.[config.prop as string]}</span>
        </el-form-item>
      } else if (config.type === 'input') {
        return (
          <el-form-item {...config}>
            <el-input
              model-value={props.data?.[config.prop as string]}
              {...{
                'onUpdate:modelValue': (val: string) => updateModelValue(val, config.prop as string)
              }}
            />
            {/* <el-input v-model={} /> */}
          </el-form-item>
        )
      }
    }
  }
})