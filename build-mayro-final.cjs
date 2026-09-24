const fs = require('node:fs');
const crypto = require('node:crypto');
const read = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const check = process.argv.includes('--check');
let css = read('dist/versions/change4.css').replaceAll('../assets/', 'assets/');
const publicRules = `/* Public edition has no design switcher. */
:root{--screen-section:calc(100svh - 74px)}body{padding-bottom:0!important}.hero{height:var(--screen-section)}
@media(max-width:640px){:root{--version-bar-height:0px;--screen-section:calc(100svh - 130px)}body{padding-bottom:0!important}.hero{height:calc(100svh - 66px);min-height:calc(100svh - 66px)}.closing-team{min-height:calc(100svh - 66px)}.mobile-booking{bottom:0;height:calc(64px + env(safe-area-inset-bottom));padding-bottom:calc(7px + env(safe-area-inset-bottom))}}
`;
const marker = '/* Calm emphasis and text-independent arrow rendering. */';
if (!css.includes(marker)) throw new Error('Public style insertion point missing; review cascade before building.');
css = css.replace(marker, publicRules + marker) + '\n@media(max-width:640px){.hero{min-height:calc(100svh - 66px)}}\n';
const js = read('dist/versions/change4.js');
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
const html = read('dist/versions/change4.html')
  .replace(/<title>.*?<\/title>/, '<title>Mayro Pilates Studio｜溜池山王のプライベートピラティス</title>')
  .replaceAll('../assets/', 'assets/')
  .replace(/change4\.css\?v=[^" ]+/, `final.css?v=${hash(css)}`)
  .replace(/change4\.js\?v=[^" ]+/, `final.js?v=${hash(js)}`)
  .replace('<link rel="stylesheet" href="../design-navigation.css">', '')
  .replace(/<nav class="design-navigation".*?<\/nav>/, '');
const trial = html.replaceAll('src="assets/', 'src="../assets/')
  .replaceAll('srcset="assets/', 'srcset="../assets/')
  .replaceAll('href="assets/', 'href="../assets/')
  .replace('href="final.css?', 'href="../final.css?')
  .replace('src="final.js?', 'src="../final.js?');
if (!check) fs.mkdirSync('dist/trial', {recursive:true});
for (const [file, value] of Object.entries({'dist/final.html': html, 'dist/final.css': css, 'dist/final.js': js, 'dist/trial/index.html':trial})) {
  if (check) { if (read(file) !== value) throw new Error(`${file} is stale: run node build-mayro-final.cjs`); }
  else fs.writeFileSync(file, value);
}
console.log(check ? 'PASS: final edition matches change4.' : 'Built final edition from change4.');
