const label = (config: RenderCell) => (
  <el-form>
    <el-form-item label="标签">
      <el-input v-model={config.label} />
    </el-form-item>
    <el-form-item label="key">
      <el-input v-model={config.prop} />
    </el-form-item>
  </el-form>
)
const input = (config: RenderCell) => (
  <el-form>
    <el-form-item label="标签">
      <el-input v-model={config.label} />
    </el-form-item>
    <el-form-item label="key">
      <el-input v-model={config.prop} />
    </el-form-item>
  </el-form>
)

function renderConfig(type: string) {
  return {
    text: label,
    input,
  }[type]
}

export default renderConfig;
