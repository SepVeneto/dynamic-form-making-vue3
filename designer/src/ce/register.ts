import { defineCustomElement } from 'vue'
import ElForm from './ElForm.ce.vue';
import ElFormItem from './ElFormItem.ce.vue'
import ElInput from './ElInput.ce.vue'
import DragWrap from './dragWrap.ce.vue'

export function register() {
  const ElFormElement = defineCustomElement(ElForm);
  const ElFormItemElement = defineCustomElement(ElFormItem)
  const ElInputElement = defineCustomElement(ElInput)

  // customElements.define('bc-form', ElFormElement);
  // customElements.define('bc-form-item', ElFormItemElement);
  // customElements.define('bc-input', ElInputElement);
  // customElements.define('drag-wrap', defineCustomElement(DragWrap))
}