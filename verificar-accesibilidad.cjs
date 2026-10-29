const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const { JSDOM } = require('jsdom');

const pagina = new JSDOM(fs.readFileSync('index.html', 'utf8'), {
  url: 'https://mercadillo.example/#inicio',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
const ventana = pagina.window;
const documento = ventana.document;
ventana.scrollTo = () => {};
ventana.HTMLElement.prototype.scrollIntoView = () => {};
ventana.matchMedia = () => ({ matches: true });
ventana.TextEncoder = TextEncoder;
Object.defineProperty(ventana, 'crypto', { value: webcrypto });
const contexto = pagina.getInternalVMContext();
const ejecutar = (codigo) => vm.runInContext(codigo, contexto);
const seleccionar = (selector) => documento.querySelector(selector);
const contar = (selector) => documento.querySelectorAll(selector).length;
const esperar = (tiempo = 90) => new Promise((resolver) => setTimeout(resolver, tiempo));

const archivos = [...documento.querySelectorAll('script[src]')].map((script) => script.getAttribute('src'));
for (const archivo of archivos) {
  const codigo = fs.readFileSync(archivo, 'utf8').replace(/iniciarAplicacion\(\);\s*$/, '');
  vm.runInContext(codigo, contexto, { filename: archivo });
}
for (const archivo of fs.readdirSync('plantillas')) {
  ejecutar(`plantillas.set(${JSON.stringify(archivo.slice(0, -5))}, ${JSON.stringify(fs.readFileSync('plantillas/' + archivo, 'utf8'))})`);
}

function navegar(ruta) {
  ventana.history.replaceState(null, '', '#' + ruta);
  ejecutar('cambiarRuta()');
}

function completar(nombre, valor, formulario) {
  const control = formulario.elements.namedItem(nombre);
  control.value = valor;
  control.dispatchEvent(new ventana.Event('input', { bubbles: true }));
  control.dispatchEvent(new ventana.Event('change', { bubbles: true }));
}

async function enviar(formulario) {
  await ejecutar('manejarFormulario')({ target: formulario, preventDefault() {} });
  await esperar(10);
}

function revisarEncabezados(ruta) {
  assert.equal(contar('#app h1'), 1, 'Un único h1 en ' + ruta);
  let anterior = 0;
  for (const encabezado of documento.querySelectorAll('#app h1, #app h2, #app h3')) {
    const nivel = Number(encabezado.tagName.slice(1));
    assert(nivel <= anterior + 1, `Jerarquía en ${ruta}: ${encabezado.textContent}`);
    anterior = nivel;
  }
}

async function verificar() {
  for (const ruta of ['inicio', 'tienda', 'categoria', 'busqueda?q=inexistente', 'producto?id=1', 'producto?id=999', 'carrito', 'checkout', 'confirmacion', 'login', 'cuenta', 'direcciones', 'pedidos', 'favoritos', 'nosotros', 'ayuda', 'seguimiento']) {
    navegar(ruta);
    revisarEncabezados(ruta);
    assert.equal(documento.activeElement, seleccionar('#app h1'), 'Foco de ruta ' + ruta);
    const ids = [...documento.querySelectorAll('[id]')].map((elemento) => elemento.id);
    assert.equal(ids.length, new Set(ids).size, 'Identificadores únicos en ' + ruta);
  }

  assert.equal(seleccionar('.skip-link').getAttribute('href'), '#app');
  navegar('tienda');
  const filtro = seleccionar('[data-filter="origin"]');
  filtro.focus();
  filtro.value = 'Alamor';
  filtro.dispatchEvent(new ventana.Event('change', { bubbles: true }));
  assert.equal(documento.activeElement, seleccionar('[data-filter="origin"]'));
  await esperar();
  assert(seleccionar('#accessibility-status').textContent.includes('productos encontrados'));
  const botonFiltros = seleccionar('[data-action="filters"]');
  assert.equal(botonFiltros.getAttribute('aria-expanded'), 'true');
  botonFiltros.click();
  assert.equal(seleccionar('#filters').hidden, true);
  assert.equal(botonFiltros.getAttribute('aria-expanded'), 'false');
  botonFiltros.click();
  assert.equal(seleccionar('#filters').hidden, false);

  navegar('tienda');
  seleccionar('[data-action="page"][data-value="2"]').focus();
  seleccionar('[data-action="page"][data-value="2"]').click();
  assert.equal(seleccionar('.pagination [aria-current="page"]').dataset.value, '2');
  assert.equal(documento.activeElement.dataset.value, '2');
  assert([...documento.querySelectorAll('.product .btn[href]')].every((enlace) => enlace.getAttribute('aria-label').startsWith('Ver detalles de')));

  navegar('categoria');
  seleccionar('[data-action="subcategory"][data-value="Molido"]').click();
  assert.equal(seleccionar('[data-value="Molido"]').getAttribute('aria-pressed'), 'true');

  navegar('producto?id=1');
  assert.equal(contar('[role="tabpanel"]'), 1);
  assert.equal(seleccionar('[data-action="favorite"]').getAttribute('aria-pressed'), 'false');
  seleccionar('[data-action="review"]').click();
  assert.equal(documento.activeElement, seleccionar('#review-form input'));
  ejecutar('alternarOpinion()');
  assert.equal(documento.activeElement, seleccionar('[data-action="review"]'));
  seleccionar('#tab-origen').click();
  seleccionar('#tab-origen').dispatchEvent(new ventana.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(documento.activeElement.id, 'tab-caracteristicas');
  assert.equal(seleccionar('[role="tabpanel"]').getAttribute('aria-labelledby'), 'tab-caracteristicas');

  ejecutar("agregarAlCarrito(1,2,'Molido','Media · filtrado','450 g'); agregarAlCarrito(2,1,'Molido','','250 g')");
  navegar('carrito');
  const aumentar = seleccionar('[data-action="quantity"][data-index="0"][data-value="1"]');
  assert(aumentar.getAttribute('aria-label').includes('Café Premium Loja'));
  aumentar.focus();
  aumentar.click();
  assert.equal(documento.activeElement.dataset.value, '1');
  await esperar();
  assert(seleccionar('#accessibility-status').textContent.includes('Total actualizado'));
  const eliminar = seleccionar('[data-action="remove-cart"][data-index="0"]');
  eliminar.focus();
  eliminar.click();
  assert.equal(documento.activeElement.dataset.action, 'remove-cart');

  navegar('checkout');
  revisarEncabezados('checkout con productos');
  const formularioPago = seleccionar('#checkout-form');
  assert.equal(formularioPago.querySelectorAll('fieldset').length, 2);
  assert.equal(formularioPago.querySelectorAll('fieldset:nth-of-type(2) [name="payment"]').length, 2);
  await enviar(formularioPago);
  assert.equal(documento.activeElement.name, 'name');
  assert.equal(documento.activeElement.getAttribute('aria-invalid'), 'true');
  assert(documento.getElementById(documento.activeElement.id + '-error').textContent);
  for (const [nombre, valor] of Object.entries({ name: 'Cliente', surname: 'Prueba', email: 'cliente@example.com', phone: '0123456789', province: 'Loja', city: 'Loja', address: 'Dirección de prueba' })) completar(nombre, valor, formularioPago);
  formularioPago.elements.email.value = 'incorrecto';
  await enviar(formularioPago);
  assert.equal(documento.activeElement.name, 'email');
  completar('email', 'cliente@example.com', formularioPago);
  formularioPago.elements.phone.value = '123';
  await enviar(formularioPago);
  assert.equal(documento.activeElement.name, 'phone');
  completar('phone', '0123456789', formularioPago);
  formularioPago.elements.terms.checked = true;
  await enviar(formularioPago);
  assert.equal(ejecutar('orders.length'), 1);
  assert.equal(documento.activeElement.textContent.trim(), '¡Gracias por tu compra!');
  const numero = ejecutar('lastOrder.number');

  navegar('seguimiento?id=' + numero);
  const formularioSeguimiento = seleccionar('[data-form="tracking"]');
  assert.equal(contar('form[data-form="tracking"]'), 1);
  assert.equal(formularioSeguimiento.elements.length, 3);
  assert.equal(seleccionar('button[type="submit"]').form, formularioSeguimiento);
  completar('email', 'otra@example.com', formularioSeguimiento);
  await enviar(formularioSeguimiento);
  assert(seleccionar('#tracking-status').textContent.includes('No encontramos'));
  completar('email', 'cliente@example.com', formularioSeguimiento);
  await enviar(formularioSeguimiento);
  assert.equal(documento.activeElement, seleccionar('#tracking-result h2'));
  assert(seleccionar('#tracking-status').textContent.includes('encontrado'));
  for (const estado of ['Recibido', 'Preparando', 'Enviado', 'Entregado']) {
    const temporal = documento.createElement('div');
    temporal.innerHTML = ejecutar(`crearProgresoPedido(${JSON.stringify(estado)})`);
    assert.equal(temporal.querySelectorAll('[aria-current="step"]').length, 1);
    assert(temporal.querySelector('[aria-current="step"]').textContent.includes(estado));
  }

  navegar('producto?id=1');
  seleccionar('[data-action="favorite"][data-id="1"]').click();
  await esperar(10);
  assert(ventana.location.hash.includes('login'));
  seleccionar('[data-action="auth-tab"][data-value="register"]').click();
  assert.equal(documento.activeElement.dataset.value, 'register');
  assert.equal(documento.activeElement.getAttribute('aria-pressed'), 'true');
  const registro = seleccionar('[data-form="auth"]');
  for (const [nombre, valor] of Object.entries({ name: 'Persona', surname: 'Prueba', email: 'registro@example.com', password: 'abcdef', confirm: 'ghijkl' })) completar(nombre, valor, registro);
  registro.elements.terms.checked = true;
  await enviar(registro);
  assert.equal(documento.activeElement.name, 'confirm');
  assert.equal(documento.activeElement.getAttribute('aria-invalid'), 'true');
  completar('confirm', 'abcdef', registro);
  await enviar(registro);
  assert.equal(ejecutar('favorites.includes(1)'), true);
  assert.equal(seleccionar('[data-action="favorite"][data-id="1"]').getAttribute('aria-pressed'), 'true');
  seleccionar('#weight').value = '450 g';
  seleccionar('#weight').dispatchEvent(new ventana.Event('change', { bubbles: true }));
  seleccionar('[data-action="favorite"][data-id="1"]').focus();
  seleccionar('[data-action="favorite"][data-id="1"]').click();
  assert.equal(seleccionar('#weight').value, '450 g');
  assert.equal(documento.activeElement.dataset.action, 'favorite');

  ejecutar("addresses=[{address:'Calle de prueba',city:'Loja',reference:''}]");
  navegar('direcciones');
  revisarEncabezados('direcciones con sesión');
  seleccionar('[data-action="new-address"]').click();
  assert.equal(documento.activeElement.name, 'address');
  seleccionar('[data-action="edit-address"]').click();
  assert.equal(documento.activeElement.name, 'address');
  assert.equal(documento.activeElement.value, 'Calle de prueba');
  assert(seleccionar('[data-action="edit-address"]').getAttribute('aria-label').includes('Calle de prueba'));

  ejecutar("orders[0].owner=profile.email");
  navegar('pedidos');
  revisarEncabezados('pedidos con sesión');
  assert(seleccionar('a[aria-label^="Ver detalle del pedido"]').getAttribute('aria-label').includes(numero));
  seleccionar('[data-action="order-filter"][data-value="En proceso"]').focus();
  seleccionar('[data-action="order-filter"][data-value="En proceso"]').click();
  assert.equal(seleccionar('[data-value="En proceso"]').getAttribute('aria-pressed'), 'true');
  assert.equal(documento.activeElement.dataset.value, 'En proceso');

  navegar('ayuda');
  seleccionar('[data-action="help-category"][data-value="Pagos"]').click();
  assert.equal(contar('#faq-list details'), 1);
  assert(seleccionar('#faq-count').textContent.includes('1 pregunta'));
  seleccionar('.navlinks a[href="#ayuda"]').click();
  assert.equal(contar('#faq-list details'), 7);
  assert(seleccionar('#faq-count').textContent.includes('7 preguntas'));
  navegar('nosotros');
  assert.equal(contar('ol.process > li'), 5);
  navegar('inicio');
  assert([...documento.querySelectorAll('.category img')].every((imagen) => imagen.alt === ''));
  seleccionar('.skip-link').click();
  assert.equal(documento.activeElement.id, 'app');

  const estilosBase = fs.readFileSync('styles.css', 'utf8');
  for (const color of ['#231709', '#faf7f0', '#a56c35', '#786c5d', '#e6dfd3']) {
    assert(estilosBase.includes(color), 'Conservar color original ' + color);
  }
  const estilosAccesibles = fs.readFileSync('accesibilidad.css', 'utf8');
  assert(!/#[\da-f]{3,8}\b/i.test(estilosAccesibles), 'La hoja accesible reutiliza la paleta sin añadir colores.');

  pagina.window.close();
  console.log('OK DOM: formularios válidos, errores asociados, foco de rutas y acciones, anuncios, seguimiento completo, estados ARIA y regresiones de ayuda, favoritos y pestañas.');
}

verificar().catch((error) => { pagina.window.close(); console.error(error); process.exitCode = 1; });
