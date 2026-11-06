'use strict';




function actualizarBotonesFavoritos() {
  document.querySelectorAll('[data-action="favorite"]').forEach((boton) => {
    const producto = buscarProducto(boton.dataset.id);
    const guardado = favorites.includes(Number(boton.dataset.id));
    boton.setAttribute('aria-pressed', String(guardado));
    if (boton.classList.contains('heart')) {
      boton.classList.toggle('selected', guardado);
      boton.textContent = guardado ? '♥' : '♡';
      boton.setAttribute('aria-label', `${guardado ? 'Eliminar de' : 'Añadir a'} favoritos: ${producto.name}`);
    } else {
      boton.textContent = guardado ? '♥ Guardado' : '♡ Añadir a favoritos';
    }
  });
}

function alternarMenu(boton) {
  const navegacion = $('.navlinks');
  navegacion.classList.toggle('open');
  boton.setAttribute('aria-expanded', navegacion.classList.contains('open'));
}



function limpiarFiltros(boton) {
  filters = crearFiltrosIniciales();
  page = 1;
  if (boton.dataset.action === 'reset-catalog') irA('tienda');
  mostrarPagina();
  anunciarCatalogo();
}

function cambiarPagina(boton) {
  page = Number(boton.dataset.value);
  mostrarPagina();
  anunciarCatalogo();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function cambiarSubcategoria(boton) {
  const categoria = boton.dataset.value;
  if (categoria === 'Especial' || categoria === 'Packs') {
    filters = crearFiltrosIniciales();
    irA('busqueda?q=' + encodeURIComponent(categoria === 'Packs' ? 'Pack' : 'especial'));
    return;
  }
  filters.presentation = filters.presentation === categoria ? '' : categoria;
  page = 1;
  mostrarPagina();
  anunciarCatalogo();
}

function cambiarPestanaAcceso(boton) {
  const correo = $('[data-form="auth"] [name="email"]')?.value || '';
  authTab = boton.dataset.value;
  mostrarPagina();
  const campoCorreo = $('[data-form="auth"] [name="email"]');
  if (campoCorreo) campoCorreo.value = correo;
  enfocar($(`[data-action="auth-tab"][data-value="${authTab}"]`));
  anunciar(authTab === 'register' ? 'Formulario para crear cuenta.' : 'Formulario para iniciar sesión.');
}


function nuevaDireccion() {
  const formulario = $('#address-form');
  formulario.reset();
  formulario.elements.index.value = -1;
  formulario.classList.remove('hidden');
  enfocar(formulario.querySelector('input[name="address"]'), false);
}

function editarDireccion(boton) {
  const indice = Number(boton.dataset.index);
  const formulario = $('#address-form');
  formulario.classList.remove('hidden');
  formulario.elements.index.value = indice;
  if (formulario.elements.province) {
    formulario.elements.province.value = addresses[indice].province || '';
    actualizarCiudades(formulario.elements.province.value);
  }
  for (const campo of ['address', 'city', 'reference']) {
    formulario.elements[campo].value = addresses[indice][campo] || '';
  }
  formulario.scrollIntoView({ behavior: 'smooth' });
  enfocar(formulario.querySelector('input[name="address"]'));
}


function filtrarPedidos(boton) {
  orderFilter = boton.dataset.value;
  mostrarPagina();
  const cantidad = document.querySelectorAll('#app .order').length;
  anunciar(`${cantidad} pedidos. Filtro: ${orderFilter}.`);
}

function filtrarAyuda(boton) {
  helpCategory = boton.dataset.value;
  const buscador = document.querySelector('[data-form="help-search"] input');
  if (buscador) buscador.value = '';
  $('#faq-list').innerHTML = crearPreguntas('', helpCategory);
  actualizarCategoriasAyuda();
  actualizarResumenAyuda();
}

function restablecerAyuda() {
  helpCategory = '';
  const buscador = document.querySelector('[data-form="help-search"] input');
  if (buscador) buscador.value = '';
  const preguntas = $('#faq-list');
  if (preguntas) preguntas.innerHTML = crearPreguntas('', '');
  actualizarCategoriasAyuda();
  actualizarResumenAyuda();
}

function actualizarCategoriasAyuda() {
  document.querySelectorAll('[data-action="help-category"]').forEach((boton) => {
    const seleccionada = boton.dataset.value === helpCategory;
    boton.classList.toggle('active', seleccionada);
    boton.setAttribute('aria-pressed', seleccionada);
  });
}

function actualizarCiudades(provincia) {
  const ciudad = $('#city');
  ciudad.innerHTML = '<option value="">--Seleccione una ciudad--</option>';
  for (const nombre of provinceCities[provincia] || []) {
    ciudad.innerHTML += '<option>' + escaparTexto(nombre) + '</option>';
  }
  ciudad.disabled = !provincia;
  limpiarErrorControl(ciudad);
  anunciar(provincia ? 'Ciudades actualizadas. Selecciona una ciudad.' : 'Selecciona una provincia para habilitar las ciudades.');
}

function aplicarFiltro(control) {
  const nombre = control.dataset.filter;
  let valor = control.value;
  if (nombre === 'stock') valor = control.checked;
  if (nombre === 'price') valor = Number(control.value);
  filters[nombre] = valor;
  page = 1;
  mostrarPagina();
  anunciarCatalogo();
}

function buscarProductos(datos) {
  filters = crearFiltrosIniciales();
  page = 1;
  irA('busqueda?q=' + encodeURIComponent(datos.q.trim()));
  mostrarPagina();
}






function datosDeEntregaValidos(datos) {
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email);
  const telefonoValido = /^\d{10}$/.test(datos.phone);
  const ciudadValida = provinceCities[datos.province]?.includes(datos.city);
  return correoValido && telefonoValido && ciudadValida;
}



function consultarPedido(datos) {
  const numero = datos.number.trim().toUpperCase();
  const correo = datos.email.trim().toLowerCase();
  const pedido = orders.find((registro) => {
    return (
      String(registro.number).toUpperCase() === numero && registro.email.toLowerCase() === correo
    );
  });
  $('#tracking-result').innerHTML = pedido
    ? crearDetallePedido(pedido)
    : '<div class="panel"><p>No encontramos un pedido con esos datos en tu cuenta.</p></div>';
  $('#tracking-status').textContent = pedido ? `Pedido ${pedido.number} encontrado. Estado: ${pedido.status}.` : 'No encontramos un pedido con esos datos en tu cuenta.';
  if (pedido) enfocar($('#tracking-result h2'), false);
}

function buscarAyuda(datos) {
  helpCategory = '';
  $('#faq-list').innerHTML = crearPreguntas(datos.q.trim(), '');
  actualizarCategoriasAyuda();
  actualizarResumenAyuda();
}


const acciones = {
  'product-tab': seleccionarPestanaProducto,
  menu: alternarMenu,
  gallery: (boton) => {
    $('#detail-photo').src = boton.dataset.src;
  },
  filters: alternarFiltros,
  'clear-filters': limpiarFiltros,
  'reset-catalog': limpiarFiltros,
  page: cambiarPagina,
  subcategory: cambiarSubcategoria,
  'auth-tab': cambiarPestanaAcceso,
  'new-address': nuevaDireccion,
  'edit-address': editarDireccion,
  'order-filter': filtrarPedidos,
  'help-category': filtrarAyuda,
  'help-clear': restablecerAyuda,
};

const formularios = {
  search: buscarProductos,
  tracking: consultarPedido,
  contact: (datos, formulario) => {
    formulario.reset();
    mostrarMensaje('Mensaje de prueba registrado. No se ha enviado ningún correo.');
  },
  'help-search': buscarAyuda,
};

async function manejarClick(evento) {
  if (evento.target.closest('a[href="#app"]')) {
    evento.preventDefault();
    enfocar($('#app'));
    $('#app').scrollIntoView();
    return;
  }

  const enlace = evento.target.closest('a[href="ayuda.html"]');
  if (enlace && obtenerRuta().name === 'ayuda') {
    evento.preventDefault();
    history.replaceState(null, '', 'ayuda.html');
    restablecerAyuda();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const boton = evento.target.closest('[data-action]');
  if (boton && acciones[boton.dataset.action] && !boton.disabled) {
    boton.disabled = true;
    try { await acciones[boton.dataset.action](boton); }
    catch (error) { mostrarMensaje(error.message || 'No se pudo completar la operación'); }
    finally { if (boton.isConnected) boton.disabled = false; }
  }
}

function manejarEntrada(evento) {
  const control = evento.target;
  if (control.type === 'tel') control.value = control.value.replace(/[^0-9]/g, '').slice(0, 10);
  limpiarErrorControl(control);
  if (control.id === 'product-qty') actualizarSeleccion();
}

function manejarCambio(evento) {
  const control = evento.target;
  limpiarErrorControl(control);
  if (['presentation', 'weight', 'grind', 'product-qty'].includes(control.id))
    actualizarSeleccion();
  if (control.id === 'province') actualizarCiudades(control.value);
  if (control.id === 'checkout-address') cargarDireccionCompra(control.value);
  if (control.name === 'payment') actualizarMetodoPago();
  if (control.dataset.filter) aplicarFiltro(control);
  if (control.id === 'sort') {
    sort = control.value;
    page = 1;
    mostrarPagina();
    anunciarCatalogo();
  }
}

async function manejarFormulario(evento) {
  const formulario = evento.target;
  const accion = formularios[formulario.dataset.form];
  if (!accion) return;
  evento.preventDefault();
  if (!validarFormulario(formulario)) return;
  const datos = Object.fromEntries(new FormData(formulario));
  if (formulario.dataset.enviando) return;
  formulario.dataset.enviando = 'true';
  const enviar = formulario.querySelector('[type="submit"], button:not([type])');
  if (enviar) enviar.disabled = true;
  try {
    await accion(datos, formulario);
  } catch (error) {
    mostrarMensaje(error.message || 'No se pudo completar la operación. Inténtalo de nuevo.');
    anunciar(error.message || 'No se pudo completar la operación.');
  } finally {
    delete formulario.dataset.enviando;
    if (enviar?.isConnected) enviar.disabled = false;
  }
}

function seleccionarPestanaProducto(boton) {
  const producto = buscarProducto(obtenerRuta().params.get('id') || 1);
  if (!producto) return;

  const apartado = informacionProducto(producto).find(
    (registro) => registro.id === boton.dataset.value,
  );
  if (!apartado) return;

  document.querySelectorAll('[data-action="product-tab"]').forEach((pestana) => {
    const activa = pestana === boton;
    pestana.classList.toggle('active', activa);
    pestana.setAttribute('aria-selected', activa);
    pestana.tabIndex = activa ? 0 : -1;
  });

  const panel = $('#product-information-panel');
  panel.setAttribute('aria-labelledby', boton.id);
  panel.innerHTML = html`<h3>${escaparTexto(apartado.titulo)}</h3>
    <p>${escaparTexto(apartado.texto)}</p>`;
}

function manejarTecladoPestanas(evento) {
  const boton = evento.target.closest('[data-action="product-tab"]');
  if (!boton) return;

  const teclas = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!teclas.includes(evento.key)) return;

  evento.preventDefault();
  const pestanas = Array.from(document.querySelectorAll('[data-action="product-tab"]'));
  let indice = pestanas.indexOf(boton);

  if (evento.key === 'ArrowRight') indice = (indice + 1) % pestanas.length;
  if (evento.key === 'ArrowLeft') indice = (indice - 1 + pestanas.length) % pestanas.length;
  if (evento.key === 'Home') indice = 0;
  if (evento.key === 'End') indice = pestanas.length - 1;

  seleccionarPestanaProducto(pestanas[indice]);
  pestanas[indice].focus();
}

document.addEventListener('click', manejarClick);
document.addEventListener('input', manejarEntrada);
document.addEventListener('change', manejarCambio);
document.addEventListener('submit', manejarFormulario);
document.addEventListener('keydown', manejarTecladoPestanas);
