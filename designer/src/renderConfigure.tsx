import configure from './config.json';

    <div class="widget-area">
      <div class="widget-box">
        <span data-tag="el-form" data-type="layout">表单</span>
      </div>
    </div>
function wrappItem(config: Record<string, any>) {
  return (
    <div class="widget-box">
      <span data-tag=""></span>
    </div>
  )
}

function createArea(name: string, compList: any[]) {
  return (
    <div class="widget-area">
      {compList.map(item => wrappItem(item))}
    </div>
  )
}

function init() {
  configure.forEach(({ label, comps }) => {
    createArea(label, comps);
  })
}