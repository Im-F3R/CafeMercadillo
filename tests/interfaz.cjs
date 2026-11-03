const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { webcrypto } = require('node:crypto');

async function probar() {
  const pagina = new JSDOM(fs.readFileSync('index.html', 'utf8'), { url: 'https://mercadillo.example/', runScripts: 'outside-only' });
  const w = pagina.window;
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.matchMedia = () => ({ matches: true });
  Object.defineProperty(w, 'crypto', { value: webcrypto });
  let conectado = false;
  let favoritos = [];
  const llamadas = [];
  const tabla = {
    producto: [{ prd_codigo__: 'P0000001', cat_codigo__: 'CAF', prd_nombre__: 'Café <img src=x onerror=alert(1)>', prd_descripcion__: 'Descripción: Café de prueba.\nOrigen: Origen de referencia: Alamor, provincia de Loja, Ecuador.\nCaracterísticas: Tostado medio, perfil equilibrado.', prd_imagen_url__: 'https://example.com/cafe.jpg', prd_iva_porcentaje__: 0 }],
    categoria: [{ cat_codigo__: 'CAF', cat_nombre__: 'Café' }],
    presentacion: [{ pre_codigo__: 'V0000101', prd_codigo__: 'P0000001', unm_codigo__: 'G', pre_cantidad__: 250, pre_molienda__: 'MOLIDO_MEDIA', pre_precio__: 17.25, pre_stock__: null }],
    metodo_pago: [{ met_codigo__: 'TRANSF', met_nombre__: 'Transferencia bancaria' }, { met_codigo__: 'TARJDEMO', met_nombre__: 'Tarjeta de prueba' }],
  };
  const cliente = {
    from: (nombre) => ({ select: () => ({ order: async () => ({ data: tabla[nombre] }), then: (resolve) => resolve({ data: tabla[nombre] }) }) }),
    rpc: async (nombre, parametros) => {
      llamadas.push({ nombre, parametros });
      if (nombre === 'tienda_opiniones') return { data: [{ calificacion: 4, comentario: '<script>alert(1)</script>', fecha: '2026-11-02' }] };
      if (nombre === 'tienda_operacion') { assert(conectado); if (parametros.p_accion === 'favorito') favoritos = parametros.p_datos.guardar ? ['P0000001'] : []; return { data: { ok: true } }; }
      return { data: { perfil: { codigo: 'U1', nombre: 'Cliente', apellido: 'Prueba', correo: 'cliente@example.test', telefono: '' }, favoritos, direcciones: [], carrito: [], pedidos: [] } };
    },
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => {},
      signInWithPassword: async () => { conectado = true; return { error: null }; },
    },
  };
  w.supabase = { createClient: () => cliente };
  const contexto = pagina.getInternalVMContext();
  const run = (codigo) => vm.runInContext(codigo, contexto);
  for (const script of w.document.querySelectorAll('script[src]')) {
    const archivo = script.getAttribute('src');
    if (archivo.endsWith('supabase-sdk.js')) continue;
    run(fs.readFileSync(archivo, 'utf8').replace(/iniciarAplicacion\(\);\s*$/, ''));
  }
  for (const archivo of fs.readdirSync('plantillas')) run(`plantillas.set(${JSON.stringify(archivo.slice(0, -5))},${JSON.stringify(fs.readFileSync('plantillas/' + archivo, 'utf8'))})`);
  await run('conectarTienda()');
  assert.equal(run('products.length'), 1);
  assert.equal(run('products[0].price'), 17.25);
  assert.equal(run('products[0].stock'), false);
  run('irA = (ruta) => { history.replaceState(null, "", urlPagina(ruta)); }');
  function navegar(ruta) { w.history.replaceState(null, '', run('urlPagina')(ruta)); run('cambiarRuta()'); }
  for (const ruta of ['inicio', 'tienda', 'producto?id=1', 'carrito', 'checkout', 'login', 'cuenta', 'direcciones', 'pedidos', 'favoritos', 'nosotros', 'ayuda', 'seguimiento']) {
    navegar(ruta);
    assert.equal(w.document.querySelectorAll('#app h1').length, 1, ruta);
    assert.equal(w.document.querySelectorAll('#app [onerror]').length, 0, ruta);
  }
  navegar('producto?id=1');
  assert(w.document.querySelector('[data-action="add-detail"]').disabled);
  assert(w.document.querySelector('#unit-price').textContent.includes('17,25') || w.document.querySelector('#unit-price').textContent.includes('17.25'));
  await run('favoritoRemoto')({ dataset: { id: '1' } });
  assert.equal(run('favoritoPendiente'), 1);
  await run('accesoRemoto')({ email: 'cliente@example.test', password: 'correcta' }, null);
  assert.equal(run('favorites[0]'), 1);
  assert(llamadas.some((l) => l.parametros?.p_accion === 'favorito'));
  run("cart = [lineaDesdeVariante('V0000101', 1)]");
  navegar('checkout');
  assert.equal(w.document.querySelector('[name="payment"]:checked').value, 'TARJDEMO');
  assert(w.document.querySelector('[value="PAYPAL"]').disabled);
  assert.equal(w.document.querySelector('#card-demo').hidden, false);
  assert.equal(w.document.querySelector('[name="cardResult"]').value, 'APROBADO');
  assert(w.document.querySelector('[form="checkout-form"]').textContent.includes('Simular pago'));
  w.document.querySelector('[value="TRANSF"]').checked = true;
  run('actualizarMetodoPago()');
  assert(w.document.querySelector('#card-demo').disabled);
  assert(w.document.querySelector('#card-demo').hidden);
  assert(run("estadoPagoVisible('SIMULADO')").includes('Sin cargo real'));
  navegar('direcciones');
  assert(w.document.querySelector('[name="province"]'));
  await run('cargarOpinionesRemotas()');
  assert.equal(w.localStorage.getItem('mercadillo-accounts'), null);
  pagina.window.close();
  console.log('Interfaz: catálogo remoto, precio por variante, stock pendiente, acceso requerido y favorito tras login correctos.');
}
probar().catch((error) => { console.error(error); process.exit(1); });
