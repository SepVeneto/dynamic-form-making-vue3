import { useWidgetsStore } from "@/store";
import { v4 as uuidv4 } from 'uuid';

export function isEmpty(obj: Record<string, any>) {
  return Object.keys(obj).length === 0
}

export function domToTree(dom: string): IDomNode {
  const widgetsStore = useWidgetsStore();
  const root = document.createElement('div');
  root.innerHTML = dom.match(/<template>[\n\s]*([\n\s\S]*)<\/template>/)?.[1] ?? dom;
  console.log(root)
  const parseDom = (el: HTMLElement) => {
    const tag = el.tagName.toLowerCase();
    const config = widgetsStore.repo[tag as keyof typeof widgetsStore.repo];
    const obj: any = {
      id: uuidv4(),
      tag,
      skip: (config as any).skip,
      type: (config as any).type ,
      style: (config as any).style,
      textContent: el.textContent,
      attrs: config.attrs,
      children: [],
    }
    Array.from(el.children).forEach((item) => {
      obj.children.push(parseDom(item as HTMLElement))
    })
    return obj
  }
  return parseDom(root.children[0] as HTMLElement)
}