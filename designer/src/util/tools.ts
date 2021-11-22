import { useWidgetsStore } from "@/store";
import { v4 as uuidv4 } from 'uuid';

export function isEmpty(obj: Record<string, any>) {
  return Object.keys(obj).length === 0
}

export function domToTree(dom: string): IDomNode {
  const widgetsStore = useWidgetsStore();
  const root = document.createElement('div');
  root.innerHTML = dom;
  const parseDom = (el: HTMLElement) => {
    const tag = el.tagName.toLowerCase();
    const obj: any = {
      id: uuidv4(),
      tag,
      textContent: el.textContent,
      attrs: widgetsStore.$state[tag as keyof typeof widgetsStore.$state].attrs,
      children: [],
    }
    Array.from(el.children).forEach((item) => {
      obj.children.push(parseDom(item as HTMLElement))
    })
    return obj
  }
  return parseDom(root.children[0] as HTMLElement)
}