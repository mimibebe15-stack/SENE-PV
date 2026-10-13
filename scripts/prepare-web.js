const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const webDir = path.join(root, 'www');
fs.rmSync(webDir, { recursive: true, force: true });
fs.mkdirSync(webDir, { recursive: true });

for (const file of ['index.html', 'styles.css', 'manifest.webmanifest']) {
  fs.copyFileSync(path.join(root, file), path.join(webDir, file));
}
fs.cpSync(path.join(root, 'assets'), path.join(webDir, 'assets'), { recursive: true });
require('esbuild').buildSync({
  entryPoints: [path.join(root, 'app.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  outfile: path.join(webDir, 'app.js'),
  minify: false
});

console.log('Archivos web preparados para Android.');
