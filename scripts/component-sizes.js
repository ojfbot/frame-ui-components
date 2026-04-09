#!/usr/bin/env node

/**
 * Component size analysis for @ojfbot/frame-ui-components.
 *
 * Measures source file sizes per component and flags anything over budget.
 * Run: pnpm size
 */

import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const COMPONENT_DIR = join(__dirname, '..', 'src', 'components')
const STYLE_DIR = join(__dirname, '..', 'src', 'styles')
const BUDGET_LINES = 200
const BUDGET_BYTES = 10_000
// Components with planned decomposition — warn but don't fail
const DECOMPOSITION_PLANNED = new Set(['MarkdownMessage'])

function getFiles(dir, ext) {
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith(ext) && !f.includes('.stories.') && !f.includes('.test.'))
      .map(f => ({ name: f, path: join(dir, f) }))
  } catch { return [] }
}

const components = getFiles(COMPONENT_DIR, '.tsx')
const styles = getFiles(STYLE_DIR, '.css')

console.log('\nComponent Size Report — @ojfbot/frame-ui-components\n')
console.log('Component'.padEnd(30) + 'Lines'.padStart(8) + 'Bytes'.padStart(10) + '  Status')
console.log('-'.repeat(60))

let overBudget = 0

for (const file of components) {
  const stat = statSync(file.path)
  const content = readFileSync(file.path, 'utf8')
  const lines = content.split('\n').length
  const bytes = stat.size
  const name = basename(file.name, extname(file.name))
  const isOver = lines > BUDGET_LINES || bytes > BUDGET_BYTES
  const isAllowlisted = DECOMPOSITION_PLANNED.has(name)
  const status = isOver ? (isAllowlisted ? ' WARN (decomp planned)' : ' OVER BUDGET') : ''
  if (isOver && !isAllowlisted) overBudget++
  console.log(
    name.padEnd(30) +
    String(lines).padStart(8) +
    String(bytes).padStart(10) +
    status
  )
}

console.log('\n' + 'Style'.padEnd(30) + 'Lines'.padStart(8) + 'Bytes'.padStart(10))
console.log('-'.repeat(48))

for (const file of styles) {
  const stat = statSync(file.path)
  const content = readFileSync(file.path, 'utf8')
  const lines = content.split('\n').length
  const name = basename(file.name, extname(file.name))
  console.log(name.padEnd(30) + String(lines).padStart(8) + String(stat.size).padStart(10))
}

const totalComponentBytes = components.reduce((sum, f) => sum + statSync(f.path).size, 0)
const totalStyleBytes = styles.reduce((sum, f) => sum + statSync(f.path).size, 0)

console.log('\n-- Summary --')
console.log(`Components: ${components.length} files, ${(totalComponentBytes / 1024).toFixed(1)} KB`)
console.log(`Styles:     ${styles.length} files, ${(totalStyleBytes / 1024).toFixed(1)} KB`)
console.log(`Total:      ${((totalComponentBytes + totalStyleBytes) / 1024).toFixed(1)} KB`)
console.log(`Budget:     ${BUDGET_LINES} lines / ${(BUDGET_BYTES / 1024).toFixed(0)} KB per component`)

if (overBudget > 0) {
  console.log(`\n${overBudget} component(s) over budget`)
  process.exit(1)
}

console.log('\nAll components within budget')
