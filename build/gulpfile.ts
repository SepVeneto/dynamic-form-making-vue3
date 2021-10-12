import path from 'path'
import fs from 'fs/promises'
import { spawn } from 'child_process'
import { series, parallel } from 'gulp'

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
async function copyConfig() {
  await fs.mkdir(path.resolve(__dirname, '../dist'))
  await run(`cp ${path.resolve(__dirname, '../packages/dynamic-form/package.json')} ${path.resolve(__dirname, '../dist/package.json')}`)
}
async function build() {
  await run(`pnpm run build:form`)
}

export default series(
  parallel(
    build,
    copyConfig
  )
)