const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const archivos = fs.readdirSync('dist').filter((nombre) => nombre.endsWith('.html'));
assert(archivos.length >= 8);
const titulos = new Set();
for (const archivo of archivos) {
  const pagina = new JSDOM(fs.readFileSync('dist/' + archivo, 'utf8'));
  const d = pagina.window.document;
  assert.equal(d.querySelectorAll('main h1').length, 1, archivo);
  assert(d.querySelector('main').textContent.trim().length > 20, archivo);
  titulos.add(d.title);
  for (const enlace of d.querySelectorAll('a[href]')) {
    const href = enlace.getAttribute('href');
    if (href === '#app' || /^https?:/.test(href)) continue;
    assert(!href.startsWith('#'), archivo + ': ' + href);
    assert(archivos.includes(href.split('?')[0]), archivo + ': destino inexistente ' + href);
  }
  pagina.window.close();
}
assert(titulos.size >= 8);
console.log(`${archivos.length} páginas con documento, título, contenido y enlaces HTML propios; sin navegación por anclas.`);
