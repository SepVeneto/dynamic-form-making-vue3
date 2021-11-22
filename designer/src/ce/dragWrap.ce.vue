<template>
  <slot v-if="render" />
  <div v-else>{{ text }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    render: String,
    text: String,
  }
})
</script>
