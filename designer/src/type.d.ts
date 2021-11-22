declare interface Config {
  data: Cell[],
  config: Record<string, unknown>
}
declare interface RenderCell {
  id: number,
  type: string,
  col?: number,
  elements?: RenderCell[],
  label?: string,
  prop?: string,
  columns?: RenderCell[],
}
declare interface Cell {
  id?: string,
  label: string,
  prop: string,
  component?: any,
  container?: boolean,
}

declare const ace: any

declare interface IDomNode {
  id: string,
  tag: string,
  snippets: string,
  attrs: Record<string, any>,
  childre: IDomNode[],
}