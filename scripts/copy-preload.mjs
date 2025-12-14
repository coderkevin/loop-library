import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

const projectRoot = cwd();
const src = path.join(projectRoot, 'src', 'main', 'preload.cjs');
const outDir = path.join(projectRoot, 'dist-electron', 'main');
const dest = path.join(outDir, 'preload.cjs');

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log(`[copy-preload] ${src} -> ${dest}`);
