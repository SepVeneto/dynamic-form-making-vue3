import { useWidgetsStore } from "@/store";
import { ExecOptionsWithStringEncoding } from "child_process";
import { v4 as uuidv4 } from 'uuid';

export function isEmpty(obj: Record<string, any>) {
  return Object.keys(obj).length === 0
}

export function domToTree(dom: string): IDomNode {
  const domstr = dom.replaceAll('\\n', '').replaceAll('bc', 'el').replaceAll('\\"', '"')
  const widgetsStore = useWidgetsStore();
  const root = document.createElement('div');
  root.innerHTML = domstr.match(/<template>[\n\s]*([\n\s\S]*)<\/template>/)?.[1] ?? domstr;
  const parseDom = (el: HTMLElement) => {
    const tag = el.tagName.toLowerCase();
    const attrMap = Object.fromEntries(Object.values(el.attributes).map(item => ([item.name, item.value])))
    const config = widgetsStore.repo[tag as keyof typeof widgetsStore.repo];
    // console.log(tag)
    const obj: any = {
      id: uuidv4(),
      tag,
      skip: (config as any)?.skip,
      type: (config as any)?.type,
      style: (config as any)?.style,
      textContent: el.textContent,
      attrs: attrMap,
      children: [],
    }
    Array.from(el.children).forEach((item) => {
      obj.children.push(parseDom(item as HTMLElement))
    })
    return obj
  }
  return parseDom(root.children[0] as HTMLElement)
}