import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROMPTS_DIR = join(__dirname, '../prompts')

function loadPrompt(name, vars = {}) {
  const path = join(PROMPTS_DIR, `${name}.md`)
  let content = readFileSync(path, 'utf-8').trim()

  // Simple variable interpolation: {varName} → value
  Object.entries(vars).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{${key}}`, 'g'), value)
  })

  return content
}

export { loadPrompt }
