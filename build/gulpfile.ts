import path from 'path'
import fs from 'fs/promises'
import { spawn } from 'child_process'
import { series, parallel } from 'gulp'
// import { Project } from 'ts-morph'

async function run(command: string, cwd: string = '') {
  new Promise<void>((resolve, reject) => {
    const args = command.split(' ');
    // const cmd = args.shift()!;
    const cmd = process.platform === 'win32' ? 'powershell.exe' : args.shift()!;
    console.log(`run: ${cmd} ${args.join(' ')}`);

    const app = spawn(cmd, args, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
}
// async function generateTypes() {
//   const project = new Project({
//     compilerOptions: {
//       allowJs: true,
//       declaration: true,
//       emitDeclarationOnly: true,
//       noEmitOnError: true,
//       out: path.resolve(__dirname, '../dist'),
//       baseUrl: path.resolve(__dirname, '..'),
//       skipLibCheck: true,
//     },
//     tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
//     skipAddingFilesFromTsConfig: true,
//   })
// }
async function copyConfig() {
  await fs.mkdir(path.resolve(__dirname, '../dist/lib'), { recursive: true })
  const packageJson = await fs.readFile(path.resolve(__dirname, '../packages/dynamic-form/package.json'), {
    encoding: 'utf-8',
  })
  const res = packageJson.replace(/index\.ts/, 'lib/index.js');
  await fs.writeFile(path.resolve(__dirname, '../dist/package.json'), res, {
    encoding: 'utf-8'
  })
  await run(`cp ${path.resolve(__dirname, '../packages/dynamic-form/index.d.ts')} ${path.resolve(__dirname, '../dist/lib')}`)
//   await fs.writeFile(path.resolve(__dirname, '../dist/global.d.ts'), `
// declare module 'vue' {
//   export interface GlobalComponents {
//     DynamicForm: typeof import('./index.es.js')
//   }
// }
//   `)
}
async function build() {
  await run(`pnpm run build:form`)
}
async function clear() {
  try {
    await fs.rm(path.resolve(__dirname, '../dist'), { recursive: true })
  } catch(err) {
    console.error(err)
  }
}

export default series(
  parallel(
    clear,
  ),
  parallel(
    build,
    copyConfig
  )
)