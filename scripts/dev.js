import { resolve } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import minimist from 'minimist';
const args = minimist(process.argv.slice(2));

const target = args._[0] || 'utils';
const format = args.f || 'iife';

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`)
const outDir = resolve(__dirname, `../packages/${target}/dist/${target}.js`);

import esbuild from 'esbuild'
esbuild.context({
  entryPoints: [entry],
  outfile: outDir,
  bundle: true,
  sourcemap: true,
  platform: 'browser',
  format, // cjs esm iife
  globalName: pkg.buildOptions?.name
}).then((ctx) => {
  console.log("start dev");
  return ctx.watch()
})

