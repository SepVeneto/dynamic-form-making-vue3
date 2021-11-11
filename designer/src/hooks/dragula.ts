import dragula from 'dragula'
import type {DragulaOptions} from 'dragula'
import { useRender } from './render'
import { nextTick } from 'vue'

const comps: Record<string, string> = {
  text: `<div>test</div>`,
  input: `<el-input />`,
  layout: `<el-row><el-col :span="12"></el-col><el-col :span="12"></el-col></el-row>`
}

export function useDragula(origin: HTMLElement, target: HTMLElement) {
  const drakeOptions: DragulaOptions = {
    copy(el, source) {
      return source.classList.contains(origin.className)
    }
  }
  const drake = dragula([origin, target], drakeOptions);
  drake.on('out', (el, container) => {
    if (container.classList.contains(target.className)) {
      const compName = (el as HTMLElement).dataset.comp!;
      const content = comps[compName];
      el.innerHTML = content;
      useRender(target)
    }
  })
}