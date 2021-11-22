<template>
  <el-form
    v-if="render === 'true'"
    v-bind="$attrs"
    style="min-height: 300px; background: #ccc;"
  ><slot /></el-form>
  <div v-else><slot /></div>
</template>

<script lang="ts">
import { ElForm } from 'element-plus'
import { defineComponent } from 'vue'
export default defineComponent({
  inheritAttrs: false,
  components: {
    ElForm,
  },
  props: {
    render: String,
  }
})
</script>

<style lang="scss" scoped>
@import 'element-plus/theme-chalk/el-form.css';
</style>
