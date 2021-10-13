type Config = RenderCell & Record<string, any>
const label = (config: Config) => (
  <el-form>
    <el-form-item label="标签">
      <el-input v-model={config.label} />
    </el-form-item>
    <el-form-item label="key">
      <el-input v-model={config.prop} />
    </el-form-item>
    <el-form-item label="必填">
      <el-input v-model={config.required} />
    </el-form-item>
  </el-form>
)
const input = (config: Config) => (
  <el-form>
    <el-form-item label="标签">
      <el-input v-model={config.label} />
    </el-form-item>
    <el-form-item label="key">
      <el-input v-model={config.prop} />
    </el-form-item>
    <el-form-item label="必填">
      <el-checkbox v-model={config.required} />
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
