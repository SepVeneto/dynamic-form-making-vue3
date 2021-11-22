import fs from 'fs'
import path from 'path'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import { parse, babelParse, compileScript, compileTemplate, transformRef } from '@vue/compiler-sfc'
const projectRoot = path.resolve(__dirname, '..', '..', 'designer');
const content = fs.readFileSync(path.resolve(projectRoot, 'src/App.vue'), 'utf-8');
const { descriptor } = parse(content)

const templateAst = parser.parse(compileTemplate({
  filename: 'awesome.vue',
  source: descriptor.template?.content ?? '',
  id: 'test'
}).code, { sourceType: 'module' })

traverse(templateAst, {
  enter(path) {
    console.log(path.node)
  }
})

const code = generate(templateAst, {}, descriptor.template?.content)
console.log(transformRef(code.code))