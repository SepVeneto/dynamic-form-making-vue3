<template>
  <el-form-item v-if="render === 'true'" v-bind="$attrs"><slot /></el-form-item>
  <div v-else><slot /></div>
</template>

<script lang="ts">
import { ElFormItem } from 'element-plus'
import { defineComponent } from 'vue'
export default defineComponent({
  inheritAttrs: false,
  components: {
    ElFormItem,
  },
  props: {
    render: String,
  }
})
</script>

<style lang="scss" scoped>
@import 'element-plus/theme-chalk/el-form.css';
</style>
