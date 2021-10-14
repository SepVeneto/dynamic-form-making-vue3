import { computed, defineComponent, PropType, toRefs } from "vue";
import { getValue, setValue } from './tools';
// import { renderFormItem } from './renderFormItem'
import renderFormItem from './renderFormItem'
export interface FormItemProps {
  config: RenderCell
  data: Record<string, any>
}
export default defineComponent({
  name: 'dynamic-form-item',
  components: {
    renderFormItem,
  },
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
    const value = computed({
      get: () => {
        return getValue(props.data, config.value.prop!)
      },
      set: (val) => {
        updateModelValue(val, config.value.prop!)
      }
    })
    /* Render */
    const text = () => (
      <span>{value.value}</span>
    )
    const input = () => (
      <el-input v-model={value.value} />
    )
    const itemMap: Record<string, any> = {
      text,
      input,
    }
    const getRenderItem = () => (
      <render-form-item config={config.value} v-slots={context.slots}>
        {itemMap[config.value.type]?.()}
      </render-form-item>
    )
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
                    v-slots={context.slots}
                    {...{
                      'onUpdate:modelValue': (val: string) => context.emit('update:modelValue', val)
                    }}
                />))}
              </el-col>
            ))}
          </el-row>
        )
      } else {
        return getRenderItem();
      }
    }
  }
})