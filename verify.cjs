const fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const elements = new Map(),
  listeners = {};
const element = (s) => {
  if (!elements.has(s))
    elements.set(s, {
      innerHTML: '',
      textContent: '',
      classList: {
        add() {},
        remove() {},
        toggle() {},
        contains() {
          return false;
        },
      },
      setAttribute() {},
      getAttribute() { return null; },
      removeAttribute() {},
      focus() {},
      value: '',
    });
  return elements.get(s);
};
const storage = new Map();
const context = vm.createContext({
  console,
  Intl,
  URLSearchParams,
  TextEncoder,
  crypto: require('node:crypto').webcrypto,
  setTimeout: () => 0,
  clearTimeout() {},
  localStorage: { getItem: (k) => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
  location: { hash: '#inicio' },
  document: {
    querySelector: element,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: (type, fn) => (listeners[type] = fn),
  },
  window: { addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: true }) },
  FormData: class {
    constructor(f) {
      return new Map(Object.entries(f.values));
    }
  },
});
const scripts = [
  'js/utilidades.js',
  'js/datos.js',
  'js/estado.js',
  'js/componentes.js',
  'js/tienda.js',
  'js/compras.js',
  'js/cuenta.js',
  'js/ayuda.js',
  'js/accesibilidad.js',
  'js/acciones.js',
  'app.js',
];
for (const archivo of scripts) {
  const codigo = fs.readFileSync(archivo, 'utf8').replace(/iniciarAplicacion\(\);\s*$/, '');
  vm.runInContext(codigo, context, { filename: archivo });
}
for (const archivo of fs.readdirSync('plantillas')) {
  if (archivo.endsWith('.html'))
    vm.runInContext(
      'plantillas.set(' +
        JSON.stringify(archivo.slice(0, -5)) +
        ',' +
        JSON.stringify(fs.readFileSync('plantillas/' + archivo, 'utf8')) +
        ')',
      context,
    );
}
const run = (s) => vm.runInContext(s, context);
assert.equal(run('products.length'), 23);
assert.equal(run('products.some(p=>p.id===4)'), false);
assert.equal(run("products.every(p=>['Mercadillo','Alamor'].includes(p.origin))"), true);
for (const [category, active] of [
  ['Café', 'Café'],
  ['Dulces', 'Productos Lojanos'],
  ['Tradicionales', 'Productos Lojanos'],
  ['Regalos', 'Productos Lojanos'],
]) {
  context.location.hash = '#categoria?tipo=' + category;
  run('mostrarEncabezado()');
  assert(
    new RegExp('aria-current="page"\\s*>\\s*' + active + '\\s*</a>').test(
      element('#header').innerHTML,
    ),
  );
}
assert.equal(run("calcularPrecioVariante(buscarProducto(1),'Molido','250 g')"), 8.5);
assert.equal(run("calcularPrecioVariante(buscarProducto(1),'Molido','450 g')"), 15.3);
assert.equal(run("calcularPrecioVariante(buscarProducto(1),'En grano','450 g')"), 16.07);
assert.equal(run("calcularPrecioVariante(buscarProducto(1),'Molido','900 g')"), 30.6);
run("agregarAlCarrito(1,2,'En grano','Sin molienda','450 g')");
assert.equal(run('subtotalCarrito()'), 32.14);
run("agregarAlCarrito(1,1,'Molido','Media · filtrado','900 g')");
assert.equal(run('cart.length'), 2);
run("agregarAlCarrito(1,1,'En grano','Sin molienda','450 g')");
assert.equal(run('cart[0].qty'), 3);
assert(run("crearCampo('Contraseña','password','password')").includes('minlength="6"'));
assert(run("crearCampo('Teléfono','phone','tel')").includes('pattern="[0-9]{10}"'));
assert.equal(run('Object.keys(provinceCities).length'), 24);
assert(/required\s+disabled/.test(run('crearUbicacion()')));
async function submit(type, values) {
  await listeners.submit({
    target: { dataset: { form: type }, reportValidity: () => true, querySelectorAll: () => [], values },
    preventDefault() {},
  });
}
(async () => {
  await submit('auth', { email: 'alpha@example.com', password: 'a' });
  assert.equal(run('profile'), null);
  run("authTab='register'");
  await submit('auth', {
    email: 'alpha@example.com',
    password: 'abcdef',
    confirm: 'abcdef',
    name: 'Alpha',
    surname: 'Test',
  });
  assert.equal(run('profile.email'), 'alpha@example.com');
  assert.equal(run('accounts[0].digest.length'), 64);
  await submit('checkout', {
    email: 'alpha@example.com',
    phone: '123',
    province: 'Loja',
    city: 'Loja',
  });
  assert.equal(run('orders.length'), 0);
  await submit('checkout', {
    email: 'alpha@example.com',
    phone: '0123456789',
    province: 'Loja',
    city: 'Quito',
  });
  assert.equal(run('orders.length'), 0);
  await submit('checkout', {
    email: 'alpha@example.com',
    phone: '0123456789',
    province: 'Loja',
    city: 'Loja',
    address: 'Ficticia',
    payment: 'Transferencia',
  });
  assert.equal(run('orders.length'), 1);
  assert.equal(run('orders[0].owner'), 'alpha@example.com');
  assert.equal(run('orders[0].items[0].unitPrice'), 16.07);
  await submit('tracking', { number: run('orders[0].number'), email: 'other@example.com' });
  assert(element('#tracking-result').innerHTML.includes('No encontramos'));
  await submit('tracking', { number: run('orders[0].number'), email: 'alpha@example.com' });
  assert(element('#tracking-result').innerHTML.includes('Recibido'));
  run("profile={email:'other@example.com',name:'Other'}");
  assert(!run('mostrarPedidos({params:new URLSearchParams()})').includes(run('orders[0].number')));
  run("profile=null;authTab='login'");
  await submit('auth', { email: 'alpha@example.com', password: 'wrongpassword' });
  assert.equal(run('profile'), null);
  await submit('auth', { email: 'alpha@example.com', password: 'abcdef' });
  assert.equal(run('profile.email'), 'alpha@example.com');
  run("helpCategory='Pagos'");
  run('restablecerAyuda()');
  assert.equal(run('helpCategory'), '');
  assert(element('#faq-list').innerHTML.includes('¿Cuánto demora el envío?'));
  const htmlInicio = run('mostrarInicio()');
  assert(htmlInicio.includes('Un poquito de Loja.'));
  assert(!htmlInicio.includes('{{'));
  for (const ruta of [
    'inicio',
    'tienda',
    'categoria',
    'busqueda',
    'producto?id=1',
    'carrito',
    'checkout',
    'confirmacion',
    'login',
    'cuenta',
    'direcciones',
    'pedidos',
    'seguimiento',
    'favoritos',
    'nosotros',
    'ayuda',
  ]) {
    context.location.hash = '#' + ruta;
    run('mostrarPagina()');
    assert(!element('#app').innerHTML.includes('{{'), ruta);
  }
  run('profile=null; favorites=[]; favoritoPendiente=null');
  context.location.hash = '#producto?id=2';
  run("cambiarFavorito({dataset:{id:'2'}})");
  assert.equal(run('favoritoPendiente'), 2);
  assert.equal(context.location.hash, 'login');
  assert.equal(run('favorites.length'), 0);
  run("authTab='login'");
  await submit('auth', { email: 'alpha@example.com', password: 'abcdef' });
  assert.equal(run('favorites.includes(2)'), true);
  assert.equal(run('favoritoPendiente'), null);
  assert.equal(context.location.hash, 'producto?id=2');
  run('profile=null; favorites=[]; favoritoPendiente=null');
  context.location.hash = '#producto?id=3';
  run("cambiarFavorito({dataset:{id:'3'}})");
  run("authTab='register'");
  await submit('auth', {
    email: 'beta@example.com',
    password: 'abcdef',
    confirm: 'incorrecta',
    name: 'Beta',
    surname: 'Prueba',
  });
  assert.equal(run('profile'), null);
  assert.equal(run('favoritoPendiente'), 3);
  await submit('auth', {
    email: 'beta@example.com',
    password: 'abcdef',
    confirm: 'abcdef',
    name: 'Beta',
    surname: 'Prueba',
  });
  assert.equal(run('profile.email'), 'beta@example.com');
  assert.equal(run('favorites.includes(3)'), true);
  assert.equal(run('favoritoPendiente'), null);
  assert.equal(context.location.hash, 'producto?id=3');
  assert.equal(run("favoriteAccounts['beta@example.com'].includes(3)"), true);
  assert.equal(run("favoriteAccounts['alpha@example.com'].includes(2)"), true);
  assert.equal(run("favoriteAccounts['alpha@example.com'].includes(3)"), false);
  const informacion = run('crearInformacionProducto(buscarProducto(1))');
  assert.equal((informacion.match(/role="tabpanel"/g) || []).length, 1);
  assert.equal((informacion.match(/role="tab"/g) || []).length, 5);
  assert(!informacion.includes('<details>'));
  run("seleccionarPestanaProducto({dataset:{value:'origen'},id:'tab-origen'})");
  assert(element('#product-information-panel').innerHTML.includes('Mercadillo'));
  const perfilCafe = run('crearPerfilCafe()');
  assert.equal((perfilCafe.match(/class="coffee-scale-step /g) || []).length, 50);
  assert(perfilCafe.includes('Aroma: 10 de 10'));
  console.log(
    'OK: vistas, precios, checkout, pedidos, ayuda, pestañas horizontales, escala de 10 y favorito tras inicio de sesión o registro.',
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
