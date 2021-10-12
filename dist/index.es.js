import { defineComponent, toRefs, computed, createVNode, resolveComponent, mergeProps } from 'vue';

function traverseObj(data, keys, index) {
  const key = keys[index];
  const res = data[key];
  if (typeof res === "object" && !Array.isArray(res)) {
    return traverseObj(res, keys, index + 1);
  } else {
    return res;
  }
}
function getValue(data, key) {
  const path = key.split(".");
  const res = traverseObj(data, path, 0);
  return res;
}
function setValue(data, key, value) {
  const path = key.split(".");
  let keyIndex = 1;
  let objIndex = 0;
  if (path.length === 1) {
    data[key] = value;
  }
  let dataP = data;
  for (; keyIndex < path.length; ++keyIndex, ++objIndex) {
    const ok = path[objIndex];
    if (dataP[ok] == null) {
      dataP[ok] = {};
    }
    dataP = dataP[ok];
  }
  dataP[path[path.length - 1]] = value;
}

var dynamicFormItem = defineComponent({
  name: "dynamic-form-item",
  props: {
    config: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const {
      config
    } = toRefs(props);
    function updateModelValue(val, key) {
      const data = {
        ...props.data
      };
      setValue(data, key, val);
      context.emit("update:modelValue", data);
    }
    const value = computed(() => {
      return getValue(props.data, config.value.prop);
    });
    return () => {
      const type = config.value.type;
      if (type === "layout") {
        return createVNode(resolveComponent("el-row"), null, {
          default: () => [config.value.elements?.map((item) => createVNode(resolveComponent("el-col"), {
            "span": item.col
          }, {
            default: () => [item.elements?.map((each) => createVNode(resolveComponent("dynamic-form-item"), mergeProps({
              "config": each,
              "data": props.data
            }, {
              "onUpdate:modelValue": (val) => context.emit("update:modelValue", val)
            }), null))]
          }))]
        });
      } else if (config.value.type === "text") {
        return createVNode(resolveComponent("el-form-item"), config.value, {
          default: () => [createVNode("span", null, [value.value])]
        });
      } else if (config.value.type === "input") {
        return createVNode(resolveComponent("el-form-item"), config.value, {
          default: () => [createVNode(resolveComponent("el-input"), mergeProps({
            "model-value": value.value
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
