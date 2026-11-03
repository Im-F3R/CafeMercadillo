const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function generarPaginas(salida) {
  const raiz = path.resolve(__dirname, '..');
  const pagina = new JSDOM(fs.readFileSync(path.join(raiz, 'index.html'), 'utf8'), {
    url: 'https://cafe-mercadillo.vercel.app/', runScripts: 'outside-only',
  });
  const w = pagina.window;
  w.scrollTo = () => {};
  w.matchMedia = () => ({ matches: true });
  w.supabase = { createClient };
  const contexto = pagina.getInternalVMContext();
  const ejecutar = (codigo) => vm.runInContext(codigo, contexto);
  for (const script of w.document.querySelectorAll('script[src]')) {
    const archivo = script.getAttribute('src');
    if (archivo.endsWith('supabase-sdk.js')) continue;
    ejecutar(fs.readFileSync(path.join(raiz, archivo), 'utf8').replace(/iniciarAplicacion\(\);\s*$/, ''));
  }
  for (const archivo of fs.readdirSync(path.join(raiz, 'plantillas'))) {
    ejecutar(`plantillas.set(${JSON.stringify(archivo.slice(0, -5))}, ${JSON.stringify(fs.readFileSync(path.join(raiz, 'plantillas', archivo), 'utf8'))})`);
  }
  ejecutar('baseDatos = window.supabase.createClient(configuracionSupabase.url, configuracionSupabase.clave, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });');
  await ejecutar('cargarCatalogoRemoto()');
  ejecutar('cargarOpinionesRemotas = async () => {};');
  const rutas = ['inicio', 'tienda', 'categoria', 'busqueda', 'producto', 'carrito', 'checkout', 'confirmacion', 'login', 'recuperar', 'cuenta', 'direcciones', 'pedidos', 'seguimiento', 'favoritos', 'nosotros', 'ayuda'];
  for (const ruta of rutas) {
    const archivo = ejecutar('urlPagina')(ruta);
    w.history.replaceState(null, '', archivo);
    ejecutar('mostrarPagina(false)');
    w.document.documentElement.setAttribute('data-pagina', ruta);
    fs.writeFileSync(path.join(salida, archivo), pagina.serialize());
  }
  pagina.window.close();
  console.log(`${rutas.length} documentos HTML independientes generados con contenido inicial.`);
};
