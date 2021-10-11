import { defineComponent, toRefs, createVNode, resolveComponent, mergeProps } from 'vue';

var dynamicFormItem = defineComponent({
  name: "dynamic-form-item",
  props: {
    config: {
      type: Object,
      required: true
    },
    data: {
      type: Object
    }
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const {
      config
    } = toRefs(props);
    function updateModelValue(val, key) {
      context.emit("update:modelValue", {
        ...props.data,
        [key]: val
      });
    }
    console.log(config.value);
    return () => {
      const type = config.value.type;
      if (type === "layout") {
        console.log(config);
        return createVNode(resolveComponent("el-row"), null, {
          default: () => [config.value.elements?.map((item) => createVNode(resolveComponent("el-col"), {
            "span": item.col
          }, {
            default: () => [item.elements?.map((each) => createVNode(resolveComponent("dynamic-form-item"), {
              "config": each
            }, null))]
          }))]
        });
      } else if (config.value.type === "text") {
        return createVNode(resolveComponent("el-form-item"), config.value, {
          default: () => [createVNode("span", null, [props.data?.[config.value.prop]])]
        });
      } else if (config.value.type === "input") {
        return createVNode(resolveComponent("el-form-item"), config.value, {
          default: () => [createVNode(resolveComponent("el-input"), mergeProps({
            "model-value": props.data?.[config.value.prop]
          }, {
            "onUpdate:modelValue": (val) => updateModelValue(val, config.value.prop)
          }), null)]
        });
      }
    };
  }
});

var DynamicForm = defineComponent({
  name: "dynamic-form",
  props: {
    config: Object,
    modelValue: Object
  },
  emits: ["update:modelValue"],
  components: {
    dynamicFormItem
  },
  setup(props, context) {
    return () => createVNode(resolveComponent("el-form"), props.config, {
      default: () => [props.config?.data.map((item) => createVNode(resolveComponent("dynamic-form-item"), mergeProps({
        "config": item,
        "data": props.modelValue
      }, {
        "onUpdate:modelValue": (val) => context.emit("update:modelValue", val)
      }), null))]
    });
  }
});

const installer = function() {
  const install = (app) => {
    app.component(DynamicForm.name, DynamicForm);
  };
  return {
    install
  };
};
var index = installer();

export { index as default };
