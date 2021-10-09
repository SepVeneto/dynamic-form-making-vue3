import './style.scss'
import draggable from 'vuedraggable'
import { defineComponent, PropType } from "@vue/runtime-core";
import compMask from './mask'
export default  defineComponent({
  name: 'components-draggable',
  components: {
    draggable,
    compMask,
  },
  props: {
    list: Array as PropType<RenderCell[]>,
    data: {
      type: Object as PropType<Record<string, unknown>>,
      required: true,
    }
  },
  setup(props, context) {
    return () => (
      <draggable
        {...context.attrs}
        list={props.list}
        item-key='prop'
        v-slots={{
          item: ({element}: {element: RenderCell}) => {
            if (element.type === 'layout') {
              return (
                <comp-mask
                  data={element}
                >
                  <el-row>
                    {element.elements?.map(item => (
                      <el-col span={item.col} class="mask-wrap">
                        <components-draggable
                          class="draggable-area"
                          list={item.elements}
                          data={props.data}
                          group={{name:'detail'}}
                        >
                        </components-draggable>
                      </el-col>
                    ))}
                  </el-row>
                </comp-mask>
              )
            } else if (element.type === 'text') {
              return (
                <comp-mask data={element} mask>
                  <span>{element.label}</span>
                  <span>{props.data[element.prop as string]}</span>
                </comp-mask>
              )
            } else if (element.type === 'input') {
              return (
                <comp-mask
                  mask
                  data={element}
                >
                  <el-input />
                  </comp-mask>
                )
            }
          }
        }}
      />
    )
  }
})