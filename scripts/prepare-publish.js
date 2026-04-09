#!/usr/bin/env node
/**
 * Prepare package.json for npm publish.
 *
 * During development, exports point at src/ (TypeScript source) so
 * file: link consumers can type-check and build without a pre-build.
 *
 * For npm publish, exports must point at dist/ (built JS + .d.ts).
 * This script rewrites the relevant fields before changeset publish.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

// Rewrite main entry points
pkg.main = './dist/index.js';
pkg.types = './dist/index.d.ts';

// Rewrite exports
pkg.exports['.'] = {
  types: './dist/index.d.ts',
  import: './dist/index.js',
  source: './src/index.ts',
};
pkg.exports['./tokens'] = {
  types: './dist/tokens.d.ts',
  import: './dist/tokens.js',
  source: './src/tokens.ts',
};

// Rewrite typesVersions
pkg.typesVersions = {
  '*': {
    '.': ['dist/index.d.ts'],
    tokens: ['dist/tokens.d.ts'],
  },
};

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('package.json prepared for npm publish (exports → dist/)');
