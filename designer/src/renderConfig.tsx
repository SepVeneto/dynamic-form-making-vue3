import { defineComponent, ref, customRef, watch } from 'vue'
import ElForm from '@/itemConfig/form'
export default defineComponent({
  name: 'RenderConfig',
  emits: ['update:modelValue'],
  components: {
    FormConfig: ElForm,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Object,
    }
  },
  setup(props, { emit }) {
    const itemList: Record<string, Record<string, string>[]> = {
      'el-form': [
        { key: ':model', type: 'input' },
      ],
      'el-form-item': [
        { key: 'prop', type: 'input' },
        { key: 'label', type: 'input' }
      ],
      'el-input': [
        { key: 'modelValue', type: 'input' }
      ],
      'el-col': [
        { key: ':span', type: 'input' }
      ],
      'el-row': [
        { key: ''}
      ]
    }
    const form = customRef<any>((track, trigger) => {
      return {
        get() {
          track();
          return props.modelValue;
        },
        set(newValue) {
          trigger();
          emit('update:modelValue', newValue)
        }
      }
    })
    const renderItem = (config: Record<string, string>) => {
      return (<el-form-item prop={config.key} label={config.key}>
        <el-input v-model={form.value[config.key]} />
      </el-form-item>)
    }
    return () => {
      console.log(props.type)
      if (!props.type) {
        return;
      }
      const config: Record<string, any> = {
        'el-form': () => (<form-config v-model={props.modelValue}/>),
      };
      const widget = config[props.type]
      return widget ? widget() : null
      // return (
      //   <el-form model={form.value}>
      //     {itemList[props.type].map(item => renderItem(item))}
      //   </el-form>
      // )
    }
  }
})