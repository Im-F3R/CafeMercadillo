'use strict';

function agregarDesdeTarjeta(boton) {
  const producto = buscarProducto(boton.dataset.id);
  if (!producto) return;
  const presentacion = producto.category === 'Café' ? 'Molido' : 'Unidad';
  agregarAlCarrito(producto.id, 1, presentacion);
}

function agregarDesdeDetalle(boton) {
  const cantidad = $('#product-qty');
  if (!cantidad.reportValidity()) return;
  agregarAlCarrito(
    boton.dataset.id,
    cantidad.value,
    $('#presentation').value,
    $('#grind')?.value || '',
    $('#weight').value,
  );
}

function cambiarFavorito(boton) {
  const idProducto = Number(boton.dataset.id);
  if (!profile) {
    favoritoPendiente = idProducto;
    returnTo = location.hash.slice(1) || 'favoritos';
    location.hash = 'login';
    mostrarMensaje('Inicia sesión para guardar favoritos');
    return;
  }
  favorites = favorites.includes(idProducto)
    ? favorites.filter((id) => id !== idProducto)
    : [...favorites, idProducto];
  favoriteAccounts[profile.email.toLowerCase()] = favorites;
  guardarDatos();
  if (obtenerRuta().name === 'favoritos') {
    mostrarPagina();
  } else {
    actualizarBotonesFavoritos();
    mostrarEncabezado();
  }
  mostrarMensaje(
    favorites.includes(idProducto) ? 'Guardado en tus favoritos' : 'Eliminado de favoritos',
  );
}

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

function cambiarCantidad(boton) {
  const indice = Number(boton.dataset.index);
  const linea = cart[indice];
  if (!linea) return;
  linea.qty = Math.min(99, linea.qty + Number(boton.dataset.value));
  if (linea.qty <= 0) cart.splice(indice, 1);
  guardarDatos();
  mostrarPagina();
  anunciar(`Cantidad de ${buscarProducto(linea.id).name}: ${Math.max(0, linea.qty)}. Total actualizado: ${formatearPrecio(totalPedidoActual())}.`);
}

function eliminarDelCarrito(boton) {
  cart.splice(Number(boton.dataset.index), 1);
  guardarDatos();
  mostrarPagina();
  mostrarMensaje('Producto eliminado del carrito');
  anunciar(`Producto eliminado. Total actualizado: ${formatearPrecio(totalPedidoActual())}.`);
}

function limpiarFiltros(boton) {
  filters = crearFiltrosIniciales();
  page = 1;
  if (boton.dataset.action === 'reset-catalog') location.hash = 'tienda';
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
    location.hash = 'busqueda?q=' + encodeURIComponent(categoria === 'Packs' ? 'Pack' : 'especial');
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

function cerrarSesion() {
  favoritoPendiente = null;
  profile = null;
  favorites = [];
  guardarDatos();
  location.hash = 'login';
  mostrarMensaje('Sesión cerrada');
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
  for (const campo of ['address', 'city', 'reference']) {
    formulario.elements[campo].value = addresses[indice][campo] || '';
  }
  formulario.scrollIntoView({ behavior: 'smooth' });
  enfocar(formulario.querySelector('input[name="address"]'));
}

function eliminarDireccion(boton) {
  addresses.splice(Number(boton.dataset.index), 1);
  guardarDatos();
  mostrarPagina();
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
  location.hash = 'busqueda?q=' + encodeURIComponent(datos.q.trim());
  mostrarPagina();
}

function aplicarCupon(datos) {
  if (datos.code.trim().toUpperCase() !== 'LOJA10') {
    mostrarMensaje('Código no válido. Prueba LOJA10.');
    return;
  }
  coupon = true;
  guardarDatos();
  mostrarPagina();
  mostrarMensaje('Descuento del 10% aplicado');
}

async function iniciarSesion(datos, formulario) {
  if (datos.password.length < 6) {
    errorFormulario(formulario, 'password', 'La contraseña debe tener al menos 6 caracteres.');
    return;
  }
  if (authTab === 'register' && datos.password !== datos.confirm) {
    errorFormulario(formulario, 'confirm', 'Las contraseñas no coinciden. Repite la contraseña anterior.');
    return;
  }
  const correo = datos.email.trim().toLowerCase();
  const credencial = await resumirContrasena(datos.password);
  let cuenta = accounts.find((registro) => registro.email === correo);
  if (authTab === 'register') {
    if (cuenta) {
      errorFormulario(formulario, 'email', 'Este correo ya tiene una cuenta. Selecciona Iniciar sesión.');
      return;
    }
    cuenta = {
      email: correo,
      name: datos.name,
      surname: datos.surname,
      phone: '',
      digest: credencial,
    };
    accounts.push(cuenta);
  } else if (!cuenta || cuenta.digest !== credencial) {
    errorFormulario(formulario, 'password', 'Correo o contraseña incorrectos. Revisa tus datos o crea una cuenta.');
    return;
  }
  profile = {
    name: cuenta.name,
    surname: cuenta.surname,
    email: correo,
    phone: cuenta.phone || '',
  };
  favorites = favoriteAccounts[correo] || [];
  completarFavoritoPendiente();
  guardarDatos();
  location.hash = returnTo;
  returnTo = 'cuenta';
  mostrarMensaje('Sesión iniciada. Tus favoritos están disponibles.');
}

function completarFavoritoPendiente() {
  if (favoritoPendiente === null) return;

  const producto = products.find((registro) => registro.id === favoritoPendiente);
  if (producto && !favorites.includes(producto.id)) favorites.push(producto.id);

  favoriteAccounts[profile.email.toLowerCase()] = favorites;
  favoritoPendiente = null;
}

function guardarPerfil(datos) {
  const correoAnterior = profile.email;
  const correoNuevo = datos.email.trim().toLowerCase();
  if (correoNuevo !== correoAnterior && accounts.some((cuenta) => cuenta.email === correoNuevo)) {
    mostrarMensaje('Ese correo pertenece a otra cuenta');
    return;
  }
  const cuenta = accounts.find((registro) => registro.email === correoAnterior);
  profile = { ...profile, ...datos, email: correoNuevo };
  if (cuenta) Object.assign(cuenta, profile);
  if (correoNuevo !== correoAnterior) {
    favoriteAccounts[correoNuevo] = favorites;
    delete favoriteAccounts[correoAnterior];
    orders.forEach((pedido) => {
      if (pedido.owner === correoAnterior) pedido.owner = correoNuevo;
    });
  }
  guardarDatos();
  mostrarPagina();
  mostrarMensaje('Información guardada');
}

function guardarDireccion(datos) {
  const direccion = { address: datos.address, city: datos.city, reference: datos.reference };
  if (Number(datos.index) < 0) addresses.push(direccion);
  else addresses[Number(datos.index)] = direccion;
  guardarDatos();
  mostrarPagina();
  mostrarMensaje('Dirección guardada');
}

function datosDeEntregaValidos(datos) {
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email);
  const telefonoValido = /^\d{10}$/.test(datos.phone);
  const ciudadValida = provinceCities[datos.province]?.includes(datos.city);
  return correoValido && telefonoValido && ciudadValida;
}

function crearRegistroPedido(datos) {
  const subtotal = subtotalCarrito();
  const envio = subtotal >= 35 ? 0 : 3.5;
  const descuento = coupon ? subtotal * 0.1 : 0;
  return {
    ...datos,
    number: 'CM-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
    date: new Date().toISOString(),
    owner: profile?.email.toLowerCase() || null,
    status: 'Recibido',
    total: subtotal + envio - descuento,
    items: cart.map((linea) => ({
      ...linea,
      unitPrice: precioLinea(linea),
      weight: linea.weight || buscarProducto(linea.id).weight,
    })),
  };
}

function registrarPedido(datos, formulario) {
  if (!datosDeEntregaValidos(datos)) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      errorFormulario(formulario, 'email', 'Ingresa un correo con formato nombre@dominio.com.');
    } else if (!/^\d{10}$/.test(datos.phone)) {
      errorFormulario(formulario, 'phone', 'Ingresa exactamente 10 dígitos.');
    } else {
      errorFormulario(formulario, datos.province ? 'city' : 'province', 'Selecciona una provincia y una ciudad correspondiente.');
    }
    return;
  }
  if (!cart.length) {
    location.hash = 'carrito';
    return;
  }
  lastOrder = crearRegistroPedido(datos);
  orders.unshift(lastOrder);
  cart = [];
  coupon = false;
  guardarDatos();
  location.hash = 'confirmacion';
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
    : '<div class="panel"><p>No encontramos un pedido con esos datos en este navegador.</p></div>';
  $('#tracking-status').textContent = pedido ? `Pedido ${pedido.number} encontrado. Estado: ${pedido.status}.` : 'No encontramos un pedido con esos datos en este navegador.';
  if (pedido) enfocar($('#tracking-result h2'), false);
}

function buscarAyuda(datos) {
  helpCategory = '';
  $('#faq-list').innerHTML = crearPreguntas(datos.q.trim(), '');
  actualizarCategoriasAyuda();
  actualizarResumenAyuda();
}

function guardarOpinion(datos, formulario) {
  const puntuacion = Math.min(5, Math.max(1, Number(datos.rating) || 1));
  $('#user-reviews').insertAdjacentHTML(
    'beforeend',
    html`
      <article class="panel review-item">
        <div class="stars">${'★'.repeat(puntuacion)}</div>
        <p>${escaparTexto(datos.review)}</p>
        <strong>${escaparTexto(datos.name)}</strong>
        <p class="demo-note">Opinión de prueba en esta sesión.</p>
      </article>
    `,
  );
  formulario.reset();
  formulario.classList.add('hidden');
  mostrarMensaje('Opinión de prueba añadida');
  enfocar($('[data-action="review"]'));
  $('[data-action="review"]').setAttribute('aria-expanded', 'false');
}

const acciones = {
  'product-tab': seleccionarPestanaProducto,
  add: agregarDesdeTarjeta,
  'add-detail': agregarDesdeDetalle,
  favorite: cambiarFavorito,
  menu: alternarMenu,
  quantity: cambiarCantidad,
  'remove-cart': eliminarDelCarrito,
  gallery: (boton) => {
    $('#detail-photo').src = boton.dataset.src;
  },
  filters: alternarFiltros,
  'clear-filters': limpiarFiltros,
  'reset-catalog': limpiarFiltros,
  page: cambiarPagina,
  subcategory: cambiarSubcategoria,
  'auth-tab': cambiarPestanaAcceso,
  recover: () =>
    mostrarMensaje('La recuperación por correo estará disponible cuando conectemos un servidor.'),
  logout: cerrarSesion,
  'new-address': nuevaDireccion,
  'edit-address': editarDireccion,
  'delete-address': eliminarDireccion,
  'order-filter': filtrarPedidos,
  'help-category': filtrarAyuda,
  'help-clear': restablecerAyuda,
  review: alternarOpinion,
};

const formularios = {
  search: buscarProductos,
  coupon: aplicarCupon,
  auth: iniciarSesion,
  profile: guardarPerfil,
  address: guardarDireccion,
  checkout: registrarPedido,
  tracking: consultarPedido,
  contact: (datos, formulario) => {
    formulario.reset();
    mostrarMensaje('Mensaje de prueba registrado. No se ha enviado ningún correo.');
  },
  'help-search': buscarAyuda,
  review: guardarOpinion,
};

function manejarClick(evento) {
  if (evento.target.closest('a[href="#app"]')) {
    evento.preventDefault();
    enfocar($('#app'));
    $('#app').scrollIntoView();
    return;
  }

  const enlace = evento.target.closest('a[href="#ayuda"]');
  if (enlace && obtenerRuta().name === 'ayuda') {
    evento.preventDefault();
    if (location.hash !== '#ayuda') location.hash = 'ayuda';
    restablecerAyuda();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const boton = evento.target.closest('[data-action]');
  if (boton && acciones[boton.dataset.action]) acciones[boton.dataset.action](boton);
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
  try {
    await accion(datos, formulario);
  } catch (error) {
    anunciar('No se pudo completar la operación. Conservamos tus datos para que puedas intentarlo de nuevo.');
    console.error(error);
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
