import { defineComponent, customRef } from 'vue'

export default defineComponent({
  name: 'ItemConfigForm',
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, context) {
    const inputPx = customRef((track, trigger) => {
      return {
        get() {
          track();
          const width = props.modelValue.labelWidth;
          const value = parseFloat(width);
          return isNaN(value) ? '' : value;
        },
        set(newValue) {
          trigger();
          props.modelValue.labelWidth = newValue + 'px'
        }
      }
    })
    return () => (
      <el-form model={props.modelValue}>
        <el-form-item label="标签宽度" prop="labelWidth">
          <el-input
            style="width: 200px"
            v-model={inputPx.value}
            v-slots={{
              suffix: () => (<span>px</span>)
            }}
          />
        </el-form-item>
        <el-form-item label="数据对象" prop=":model">
          <el-input
            style="width: 200px"
            v-model={props.modelValue[':model']}
          />
        </el-form-item>
      </el-form>
    )
  }
})
