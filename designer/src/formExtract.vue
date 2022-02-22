<template>
  <div class="form-extract" v-loading="loading">
    <div class="upload" ref="uploadRef"></div>
    <el-button type="primary" @click="handleTransform">转换代码</el-button>
    <input type="file" ref="fileRef" style="display: none">
    <div>{{response}}</div>
  </div>
</template>

<script lang="ts">
import { OptionProps } from 'element-plus/es/components/select-v2/src/defaults';
import { defineComponent, onMounted, ref } from 'vue'
import { useFetch } from './hooks/hooks';
import { request } from './util/request'
export default defineComponent({
  name: 'FormExtract',
})
</script>

<script lang="ts" setup>
const uploadRef = ref<HTMLDivElement>()
const fileRef = ref<HTMLInputElement>()
const file = ref<File>()
const response = ref()
const loading = ref(false)

onMounted(() => {
  document.addEventListener('paste', (event) => {
    const reader = new FileReader()
    const image =event.clipboardData?.files[0]
    if (!image) {
      return;
    }
    reader.onload = (e) => {
      if (!e.target?.result) {
        return;
      }
      const img = document.createElement('img')
      img.src = e.target.result as string
      uploadRef.value?.appendChild(img)
      file.value = image
    }
    reader.readAsDataURL(image)
  })
})

async function handleTransform() {
  loading.value = true
  const form = new FormData()
  file.value && form.append('file', file.value)
  try {
    const res = await request('/api/upload', {
      method: 'post',
      body: form,
    })
    response.value = res;
  } finally {
    loading.value = false;
  }
  // const res = fetch('/api/upload', {
  //   method: 'post',
  //   // headers: {
  //     // 'Content-Type': 'multipart/form-data; boundary=sepveneto',
  //     body: form
  //   // }
  // }).post().json()
  // response.value = res.data
  // console.log(res.data)
}
</script>

<style lang="scss" scoped>
.form-extract {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 2;
}
.upload {
  margin: 0 auto;
  width: 400px;
  height: 400px;
  border: 2px solid #222;
}
</style>