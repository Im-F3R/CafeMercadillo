'use strict';

const configuracionSupabase = {
  url: 'https://ocprgekkwykgvghrsfrd.supabase.co',
  clave: 'sb_publishable_D4X7-HnT-UhroKxkhPp6gQ_79YkVxCp',
};

let baseDatos;
let catalogoRemoto = false;
let metodosPago = [];
let solicitudPedido = null;

async function resultadoConsulta(consulta) {
  const { data, error } = await consulta;
  if (error) throw new Error(error.message);
  return data;
}

function idProducto(codigo) {
  return /^P\d{7}$/.test(codigo) ? Number(codigo.slice(1)) : codigo;
}

function imagenSegura(url) {
  try { return new URL(url).protocol === 'https:' ? url : 'favicon.svg'; }
  catch { return 'favicon.svg'; }
}

function varianteVista(v) {
  const molienda = { MOLIDO_MEDIA: 'Media · filtrado', MOLIDO_FINA: 'Fina · espresso', MOLIDO_GRUESA: 'Gruesa · prensa francesa', EN_GRANO: 'Sin molienda' };
  return {
    code: v.pre_codigo__, productCode: v.prd_codigo__,
    price: v.pre_precio__ === null ? null : Number(v.pre_precio__),
    stock: v.pre_stock__ === null ? null : Number(v.pre_stock__),
    weight: v.unm_codigo__ === 'G' ? `${Number(v.pre_cantidad__)} g` : 'Unidad',
    presentation: v.pre_molienda__ === 'EN_GRANO' ? 'En grano' : v.pre_molienda__ === 'NO_APLICA' ? 'Unidad' : 'Molido',
    grind: molienda[v.pre_molienda__] || '',
  };
}

async function cargarCatalogoRemoto() {
  const [registros, categorias, variantes, metodos] = await Promise.all([
    resultadoConsulta(baseDatos.from('producto').select('prd_codigo__,cat_codigo__,prd_nombre__,prd_descripcion__,prd_imagen_url__,prd_iva_porcentaje__').order('prd_codigo__')),
    resultadoConsulta(baseDatos.from('categoria').select('cat_codigo__,cat_nombre__')),
    resultadoConsulta(baseDatos.from('presentacion').select('pre_codigo__,prd_codigo__,unm_codigo__,pre_cantidad__,pre_molienda__,pre_precio__,pre_stock__').order('pre_codigo__')),
    resultadoConsulta(baseDatos.from('metodo_pago').select('met_codigo__,met_nombre__')),
  ]);
  const lista = registros.map((p) => {
    const opciones = variantes.filter((v) => v.prd_codigo__ === p.prd_codigo__).map(varianteVista);
    const descripcion = p.prd_descripcion__ || '';
    const origen = descripcion.match(/Origen de referencia: ([^,]+),/)?.[1] || 'Loja';
    const tostado = descripcion.match(/Tostado ([^,]+),/)?.[1] || '';
    return {
      id: idProducto(p.prd_codigo__), code: p.prd_codigo__, name: p.prd_nombre__,
      description: descripcion, category: categorias.find((c) => c.cat_codigo__ === p.cat_codigo__)?.cat_nombre__ || '',
      image: imagenSegura(p.prd_imagen_url__), origin: origen,
      roast: tostado.charAt(0).toUpperCase() + tostado.slice(1), variants: opciones,
      price: opciones.find((v) => v.price !== null)?.price || 0,
      presentation: opciones[0]?.presentation || 'Unidad', weight: opciones[0]?.weight || 'Unidad',
      stock: opciones.some((v) => v.stock > 0 && v.price !== null),
    };
  });
  products.splice(0, products.length, ...lista);
  metodosPago = metodos;
  catalogoRemoto = true;
}

function buscarVariante(p, presentacion, peso, molienda = '') {
  return p?.variants?.find((v) => v.presentation === presentacion && v.weight === peso &&
    (presentacion !== 'Molido' || v.grind === (molienda || 'Media · filtrado')));
}

function lineaDesdeVariante(codigo, cantidad) {
  const p = products.find((p) => p.variants?.some((v) => v.code === codigo));
  const v = p?.variants.find((v) => v.code === codigo);
  if (!v) return null;
  return { id: p.id, variant: codigo, qty: cantidad, presentation: v.presentation, weight: v.weight, grind: v.grind, unitPrice: v.price };
}

async function cargarCuentaRemota() {
  const datos = await resultadoConsulta(baseDatos.rpc('tienda_cuenta'));
  const p = datos.perfil;
  profile = { code: p.codigo, name: p.nombre || '', surname: p.apellido || '', email: p.correo, phone: p.telefono || '' };
  favorites = datos.favoritos.map(idProducto);
  addresses = datos.direcciones.map((d) => ({ code: d.dir_codigo__, province: d.dir_provincia__, city: d.dir_ciudad__, address: d.dir_calle_principal__, reference: d.dir_referencia__ || '' }));
  cart = datos.carrito.map((c) => lineaDesdeVariante(c.pre_codigo__, Number(c.dca_cantidad__))).filter(Boolean);
  orders = datos.pedidos.map((o) => ({
    number: o.codigo, date: o.fecha, status: o.estado, total: Number(o.total), owner: profile.email.toLowerCase(), email: profile.email,
    address: o.resumen?.direccion || '', city: o.resumen?.ciudad || '',
    payment: metodosPago.find((m) => m.met_codigo__ === o.resumen?.metodo)?.met_nombre__ || 'Pendiente',
    paymentStatus: o.pagos?.[0]?.estado || 'PENDIENTE', tracking: o.seguimiento || [],
    items: (o.resumen?.items || []).map((i) => ({
      id: idProducto(i.producto), name: i.nombre, image: imagenSegura(i.imagen), qty: i.cantidad,
      unitPrice: i.precio, weight: i.unidad === 'G' ? `${i.contenido} g` : 'Unidad',
      presentation: i.molienda === 'EN_GRANO' ? 'En grano' : i.molienda === 'NO_APLICA' ? 'Unidad' : 'Molido',
    })),
  }));
}

async function operacionRemota(accion, datos) {
  if (!profile) throw new Error('Inicia sesión para continuar');
  const respuesta = await resultadoConsulta(baseDatos.rpc('tienda_operacion', { p_accion: accion, p_datos: datos }));
  await cargarCuentaRemota();
  return respuesta;
}

function solicitarSesion(destino) {
  if (profile) return true;
  const ruta = obtenerRuta();
  returnTo = destino || ruta.name + (location.search || '');
  sessionStorage.setItem('mercadillo-retorno', returnTo);
  sessionStorage.setItem('mercadillo-favorito-pendiente', JSON.stringify(favoritoPendiente));
  irA('login');
  mostrarMensaje('Inicia sesión para continuar');
  return false;
}

async function conectarTienda() {
  const recuperando = new URLSearchParams(location.hash.slice(1)).get('type') === 'recovery';
  baseDatos = window.supabase.createClient(configuracionSupabase.url, configuracionSupabase.clave);
  profile = null;
  cart = [];
  orders = [];
  favorites = [];
  addresses = [];
  lastOrder = null;
  coupon = false;
  for (const clave of ['accounts', 'profile', 'favoriteAccounts', 'favorites', 'orders', 'addresses', 'lastOrder', 'cart', 'coupon']) {
    localStorage.removeItem('mercadillo-' + clave);
  }
  await cargarCatalogoRemoto();
  const { data, error } = await baseDatos.auth.getSession();
  if (error) throw error;
  if (data.session) await cargarCuentaRemota();
  if (data.session && recuperando) irA('recuperar');
  baseDatos.auth.onAuthStateChange((evento) => {
    if (evento === 'PASSWORD_RECOVERY') {
      setTimeout(() => irA('recuperar'), 0);
    }
    if (evento === 'SIGNED_OUT') {
      profile = null; favorites = []; cart = []; orders = []; addresses = []; lastOrder = null;
      setTimeout(() => mostrarPagina(), 0);
    }
  });
}

async function accesoRemoto(datos, formulario) {
  if (authTab === 'register' && datos.password !== datos.confirm) {
    errorFormulario(formulario, 'confirm', 'Las contraseñas no coinciden');
    return;
  }
  if (authTab === 'register') {
    const { data, error } = await baseDatos.auth.signUp({ email: datos.email.trim(), password: datos.password,
      options: { emailRedirectTo: location.origin + '/', data: { nombre: `${datos.name} ${datos.surname}`.trim() } } });
    if (error) {
      const mensajes = {
        over_email_send_rate_limit: 'El servicio alcanzó el límite de envío de correos. No sigas intentando con otros correos; contacta al administrador de la demostración.',
        email_address_invalid: 'El servicio de acceso rechazó esta dirección de correo. Revisa que esté escrita correctamente.',
        email_address_not_authorized: 'El servicio de correo no tiene autorizado enviar a esta dirección. Contacta al administrador de la demostración.',
        over_request_rate_limit: 'Has realizado demasiados intentos. Espera unos minutos antes de volver a registrarte.',
        user_already_exists: 'Ya existe una cuenta con este correo. Inicia sesión con tu contraseña.',
        weak_password: 'La contraseña no cumple los requisitos de seguridad. Usa al menos 6 caracteres.'
      };
      throw new Error(mensajes[error.code] || 'No se pudo crear la cuenta. Inténtalo nuevamente en unos momentos.');
    }
    if (!data.session) {
      sessionStorage.setItem('mercadillo-favorito-pendiente', JSON.stringify(favoritoPendiente));
      mostrarMensaje('Revisa tu correo para confirmar la cuenta. Después inicia sesión.');
      authTab = 'login'; mostrarPagina(); return;
    }
  } else {
    const { error } = await baseDatos.auth.signInWithPassword({ email: datos.email.trim(), password: datos.password });
    if (error) {
      const mensajes = {
        invalid_credentials: 'El correo o la contraseña son incorrectos. Revisa tus datos e inténtalo nuevamente.',
        email_not_confirmed: 'Esta cuenta tiene pendiente la confirmación. Contacta al administrador de la demostración para habilitarla.',
        over_request_rate_limit: 'Has realizado demasiados intentos. Espera unos minutos antes de volver a iniciar sesión.',
        user_banned: 'Esta cuenta no está habilitada. Contacta al administrador.'
      };
      throw new Error(mensajes[error.code] || 'No se pudo conectar con el servicio de acceso. Inténtalo nuevamente en unos momentos.');
    }
  }
  await cargarCuentaRemota();
  const pendiente = favoritoPendiente ?? JSON.parse(sessionStorage.getItem('mercadillo-favorito-pendiente') || 'null');
  const producto = buscarProducto(pendiente);
  if (producto) await operacionRemota('favorito', { producto: producto.code, guardar: true });
  favoritoPendiente = null;
  sessionStorage.removeItem('mercadillo-favorito-pendiente');
  sessionStorage.removeItem('mercadillo-retorno');
  irA(returnTo);
  returnTo = 'cuenta';
  mostrarPagina();
  mostrarMensaje('Sesión iniciada');
}

async function favoritoRemoto(boton) {
  const p = buscarProducto(boton.dataset.id);
  if (!p) return;
  if (!profile) favoritoPendiente = p.id;
  if (!solicitarSesion()) return;
  await operacionRemota('favorito', { producto: p.code, guardar: !favorites.includes(p.id) });
  mostrarPagina();
}

async function agregarRemoto(id, cantidad, presentacion, peso, molienda) {
  if (!solicitarSesion()) return;
  const p = buscarProducto(id);
  const v = buscarVariante(p, presentacion || p.presentation, peso || p.weight, molienda);
  if (!v || v.price === null) throw new Error('Selecciona una presentación disponible');
  const actual = cart.find((c) => c.variant === v.code)?.qty || 0;
  await operacionRemota('carrito', { presentacion: v.code, cantidad: actual + Number(cantidad) });
  mostrarEncabezado(); mostrarMensaje('Producto añadido al carrito');
}

async function pedidoRemoto(datos, formulario) {
  if (!solicitarSesion('checkout')) return;
  if (!datosDeEntregaValidos(datos)) throw new Error('Revisa el teléfono, provincia y ciudad');
  if (datos.payment === 'PAYPAL') throw new Error('PayPal no está disponible');
  const estado = $('#payment-status');
  const boton = $('[form="checkout-form"]');
  if (boton) boton.disabled = true;
  if (estado) estado.textContent = datos.payment === 'TARJDEMO' ? 'Procesando pago simulado… No se realizará ningún cargo.' : 'Registrando pedido de prueba…';
  solicitudPedido ||= crypto.randomUUID();
  try {
    const resultado = await operacionRemota('pedido', {
      solicitud: solicitudPedido, nombre: `${datos.name} ${datos.surname}`.trim(), telefono: datos.phone,
      provincia: datos.province, ciudad: datos.city, direccion: datos.address, referencia: datos.reference,
      metodo: datos.payment, simulacion: datos.payment === 'TARJDEMO' ? datos.cardResult : undefined,
    });
    lastOrder = orders.find((o) => o.number === resultado.pedido);
    solicitudPedido = null;
    await cargarCatalogoRemoto();
    irA('confirmacion?id=' + encodeURIComponent(resultado.pedido));
  } catch (error) {
    if (estado) estado.textContent = error.message;
    throw error;
  } finally {
    if (boton?.isConnected) boton.disabled = false;
  }
}

async function cargarOpinionesRemotas() {
  const p = buscarProducto(obtenerRuta().params.get('id'));
  const contenedor = $('#user-reviews');
  if (!baseDatos || !p || !contenedor) return;
  try {
    const opiniones = await resultadoConsulta(baseDatos.rpc('tienda_opiniones', { p_producto: p.code }));
    if (!contenedor.isConnected) return;
    contenedor.innerHTML = opiniones.map((o) => `<article class="panel review-item"><p>${Number(o.calificacion)} de 5 estrellas</p><p>${escaparTexto(o.comentario)}</p><p>${escaparTexto(o.fecha)}</p></article>`).join('') || '<p>Todavía no hay opiniones.</p>';
  } catch { contenedor.textContent = 'No se pudieron cargar las opiniones. Vuelve a intentarlo.'; }
}

function mostrarRecuperacion() {
  return `<div class="wrap narrow"><h1>Nueva contraseña</h1><form data-form="password"><label>Contraseña nueva<input name="password" type="password" minlength="6" maxlength="100" autocomplete="new-password" required></label><button class="btn">Guardar contraseña</button></form></div>`;
}

Object.assign(acciones, {
  review: (b) => { if (solicitarSesion()) alternarOpinion(b); },
  favorite: favoritoRemoto,
  add: (b) => { const p = buscarProducto(b.dataset.id); return agregarRemoto(p.id, 1, p.presentation, p.weight); },
  'add-detail': (b) => { if ($('#product-qty').reportValidity()) return agregarRemoto(b.dataset.id, $('#product-qty').value, $('#presentation').value, $('#weight').value, $('#grind')?.value); },
  quantity: async (b) => { const c = cart[Number(b.dataset.index)]; await operacionRemota('carrito', { presentacion: c.variant, cantidad: Math.max(0, c.qty + Number(b.dataset.value)) }); mostrarPagina(); },
  'remove-cart': async (b) => { await operacionRemota('carrito', { presentacion: cart[Number(b.dataset.index)].variant, cantidad: 0 }); mostrarPagina(); },
  logout: async () => { const { error } = await baseDatos.auth.signOut(); if (error) throw error; irA('login'); },
  'delete-address': async (b) => { await operacionRemota('eliminar_direccion', { codigo: addresses[Number(b.dataset.index)].code }); mostrarPagina(); },
  recover: async () => {
    const correo = document.querySelector('[name="email"]');
    if (!correo?.reportValidity()) return;
    const { error } = await baseDatos.auth.resetPasswordForEmail(correo.value, { redirectTo: location.origin + '/' });
    if (error) throw error;
    mostrarMensaje('Si el correo tiene una cuenta, recibirás instrucciones para recuperar el acceso.');
  },
});

Object.assign(formularios, {
  auth: accesoRemoto,
  profile: async (d) => {
    if (d.email.trim().toLowerCase() !== profile.email.toLowerCase()) throw new Error('El correo de acceso no se cambia desde este formulario.');
    await operacionRemota('perfil', { nombre: d.name, apellido: d.surname, telefono: d.phone });
    mostrarPagina(); mostrarMensaje('Perfil guardado');
  },
  address: async (d) => {
    if (!provinceCities[d.province]?.includes(d.city)) throw new Error('Selecciona una provincia y ciudad válidas');
    await operacionRemota('direccion', { codigo: addresses[Number(d.index)]?.code, provincia: d.province, ciudad: d.city, direccion: d.address, referencia: d.reference });
    mostrarPagina(); mostrarMensaje('Dirección guardada');
  },
  checkout: pedidoRemoto,
  tracking: async (d) => {
    if (!solicitarSesion('seguimiento')) return;
    await cargarCuentaRemota();
    consultarPedido(d);
  },
  review: async (d) => {
    if (!solicitarSesion()) return;
    await operacionRemota('opinion', { producto: buscarProducto(obtenerRuta().params.get('id')).code, calificacion: d.rating, comentario: d.review });
    mostrarPagina();
  },
  password: async (d) => { const { error } = await baseDatos.auth.updateUser({ password: d.password }); if (error) throw error; irA('cuenta'); },
});
