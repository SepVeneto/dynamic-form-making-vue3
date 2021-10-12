declare interface Config {
  data: RenderCell[],
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
  label: string,
  prop: string,
  component?: any,
}

declare const ace: any