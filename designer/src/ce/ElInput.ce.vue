<template>
  <el-input v-if="render === 'true'" v-bind="$attrs" />
  <div v-else><slot /></div>
</template>

<script lang="ts">
import { ElInput } from 'element-plus'
import { defineComponent } from 'vue'
export default defineComponent({
  inheritAttrs: false,
  components: {
    ElInput,
  },
  props: {
    render: String
  },
})
</script>

<style lang="scss">
@import 'element-plus/theme-chalk/el-input.css';
</style>
