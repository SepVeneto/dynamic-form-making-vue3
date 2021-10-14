import type { Slots, SetupContext, PropType } from 'vue'
import { computed, toRefs, defineComponent } from 'vue'
import type { FormItemProps } from '../dynamic-form-item'
import { getValue } from '../tools'

export function renderFormItem(config: RenderCell, slots: Slots, element: () => JSX.Element) {
  const key = config.prop!;
  return (
    <el-form-item {...config}>
      {slots[key]?.() ?? element()}
    </el-form-item>
  )
}
export default defineComponent({
  name: 'RenderFormItem',
  props: {
    config: {
      type: Object as PropType<RenderCell>,
      required: true,
    }
  },
  setup(props, context) {
    const key = computed(() => props.config.prop!);
    return () => (
      <el-form-item {...props.config}>
        {context.slots[key.value]?.(props.config) ?? context.slots.default?.(props.config)}
      </el-form-item>
    )
  }
})