const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const salida = path.resolve(__dirname, '../dist');
fs.mkdirSync(salida, { recursive: true });
for (const archivo of ['index.html', 'styles.css', 'accesibilidad.css', 'app.js', 'favicon.svg', 'js', 'plantillas']) {
  fs.cpSync(path.resolve(__dirname, '..', archivo), path.join(salida, archivo), { recursive: true });
}
esbuild.buildSync({ entryPoints: [path.join(__dirname, 'sdk.js')], bundle: true, minify: true, outfile: path.join(salida, 'js/supabase-sdk.js'), platform: 'browser', format: 'iife' });
