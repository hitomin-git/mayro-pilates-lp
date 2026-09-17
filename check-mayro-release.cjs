const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
execFileSync(process.execPath, ['build-mayro-final.cjs', '--check'], {stdio:'inherit'});
execFileSync(process.execPath, ['check-mayro-versions.cjs'], {stdio:'inherit'});
const tracked = new Set(execFileSync('git', ['ls-files', '-z', 'dist'], {encoding:'utf8'}).split('\0'));
const failures = [];
for (const file of tracked) {
  if (!/\.(html|css)$/.test(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const refs = file.endsWith('.html') ? [...content.matchAll(/(?:src|href)="([^"]+)"/g)] : [...content.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)];
  for (const [,ref] of refs) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), ref.split(/[?#]/)[0]));
    if (!tracked.has(target)) failures.push(`${file}: ${target} is not staged/tracked by Git`);
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log('PASS: all published local references are included in Git.');
