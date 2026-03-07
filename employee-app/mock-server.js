import { spawn } from 'node:child_process'

const servers = [
  { file: 'db-step1.json', port: 4001 },
  { file: 'db-step2.json', port: 4002 },
]

for (const { file, port } of servers) {
  const proc = spawn(
    'npx',
    ['json-server', '--port', String(port), file],
    { stdio: 'inherit', shell: true },
  )

  proc.on('error', (err) => {
    console.error(`Failed to start json-server for ${file}:`, err)
  })

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`json-server for ${file} exited with code ${code}`)
    }
  })
}
