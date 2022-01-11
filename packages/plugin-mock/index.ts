import type { Plugin, ViteDevServer } from 'vite'
import { parse, compileScript } from '@vue/compiler-sfc'
import { parseURL } from 'ufo'
import {readFile} from 'fs'
import path from 'path'

function PluginMock(): Plugin {
  function configureServer(server: ViteDevServer) {
    server.middlewares.use('/mock-api', (req, res, next) => {
      const { pathname, search } = parseURL(req.url);
      if (pathname === '/el-form') {
        const file = path.join(process.cwd(), 'plugins', pathname + '.vue')
        readFile(file, 'utf-8', (err, data) => {
          // console.log(compileScript(parse(data).descriptor, { id: file }))
          res.write(JSON.stringify({
            tag: 'form-item',
            type: 'component',
            code: data,
          }))
          res.end();
        })
      }
    })
  }
  return <Plugin>{
    name: 'vite-plugin-mock',
    apply: 'serve',
    configureServer
  }
}

export default PluginMock;
