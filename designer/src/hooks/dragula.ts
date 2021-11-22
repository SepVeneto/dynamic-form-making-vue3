import dragula from 'dragula'
import type {DragulaOptions} from 'dragula'
import { useRender } from './render'
import { nextTick } from 'vue'

const comps: Record<string, string> = {
  text: `<div>test</div>`,
  input: `<el-input />`,
  layout: `<el-row><el-col :span="12"></el-col><el-col :span="12"></el-col></el-row>`,
  form: `<el-form></el-form>`
}

export function useDragula(origin: HTMLElement, target: HTMLElement) {
  const drakeOptions: DragulaOptions = {
    copy(el, source) {
      return source.classList.contains('left')
      // return source.classList.contains(origin.className)
    }
  }
  const drake = dragula([origin, target], drakeOptions);
  drake.on('drop', (el, container, source, sibling) => {
    if (!container) {
      return;
    }
    // console.log(container, source, sibling)
    // const compName = (el as HTMLElement).dataset.comp!;
    // const contain = JSON.parse((el as HTMLElement).dataset.container!)
    // const content = comps[compName];
    (el as any).render = 'true'
    // if (source.classList.contains('left')) {
    //   el.innerHTML = '';
    // }
    // el.innerHTML = content;
    // useRender(target)
    // nextTick().then(() => {
      collectContainers(drake, container as HTMLElement);
    // })
  })
}

function collectContainers(drake: dragula.Drake, wrap: HTMLElement) {
  drake.containers.splice(2, drake.containers.length - 2);
  const containers = wrap.querySelectorAll('[data-container=true]');
  const list = Array.from(containers);
  list.forEach(item => item.classList.add('container'));
  drake.containers.push(...list);
}