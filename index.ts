import { App } from 'vue'
import DynamicForm from './dynamic-form'

const installer = function() {
  const install = (app: App) => {
    app.component(DynamicForm.name, DynamicForm);
  }
  return {
    install
  }
}

export default installer()