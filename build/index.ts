import esbuild from 'rollup-plugin-esbuild'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import fs from 'fs'
import rollup from 'rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'
const rootPath = path.resolve(__dirname, '..');
const packagePath = path.resolve(rootPath, 'packages');
const designerPath = path.resolve(rootPath, 'designer');
const distPath = path.resolve(rootPath, 'dist');
const plugins = [
  typescript({
    target: 'es6',
    include: [
      `${packagePath}/**/*.ts`,
      `${packagePath}/**/*.tsx`,
      `${packagePath}/**/*.d.ts`,
    ],
    noEmitOnError: true,
  }),
  vueJsx(),
  esbuild(),
]
async function build() {
  try {
    const entry = path.resolve(packagePath, 'dynamic-form/index.ts');
    const rollupConfig = {
      input: entry,
      plugins,
      external: (id: string) => {
        return id.startsWith('vue')
      }
    }
    const esm = {
      format: 'es',
      file: path.resolve(distPath, 'index.es.js'),
    }
    const bundle = await rollup.rollup(rollupConfig);
    await bundle.write(esm as any);
  } catch(err) {
    console.error(err)
  }
}

build();