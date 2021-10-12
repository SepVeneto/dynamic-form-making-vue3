<template>
  <div id="ace-editor"></div>
</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'AceEditor',
})
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  type: string,
  content?: string
  modelValue: string,
}>(), {
  type: 'html'
})
const emits = defineEmits<{
  (e: 'update:modelValue', content: string): void
}>()
let editor: any;
onMounted(() => {
  ace.config.set('basePath', 'https://pagecdn.io/lib/ace/1.4.12/')
  editor = ace.edit("ace-editor");
  editor.setTheme("ace/theme/twilight");
  editor.session.setMode(`ace/mode/${props.type}`);
  editor.on('change', () => {
    emits('update:modelValue', editor.getValue())
  })
  props.modelValue && editor.session.setValue(props.modelValue)
})
function beauty() {
  const session = editor.getSession();
  session.setValue(JSON.stringify(JSON.parse(session.getValue()), null, 2))
}
function getContent() {
  return editor.getValue();
}
defineExpose({
  getContent,
  beauty,
})
</script>

<style lang="scss" scoped>
#ace-editor {
  width: 100%;
  min-height: 300px;
}
</style>
