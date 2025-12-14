import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

const projectRoot = cwd();
const src = path.join(projectRoot, 'src', 'main', 'preload.cjs');
const outDir = path.join(projectRoot, 'dist-electron');
const dest = path.join(outDir, 'preload.cjs');

function copy() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`[watch-preload] copied preload -> ${dest}`);
}

copy();

fs.watch(src, { persistent: true }, () => {
  try {
    copy();
  } catch (err) {
    console.error('[watch-preload] copy failed', err);
  }
});
