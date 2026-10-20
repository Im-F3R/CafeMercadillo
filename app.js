'use strict';

function obtenerRuta() {
  const [name, query] = (location.hash.slice(1) || 'inicio').split('?');
  return { name, params: new URLSearchParams(query || '') };
}

function mostrarPagina() {
  const ruta = obtenerRuta();
  mostrarEncabezado();
  mostrarPie();
  const views = {
    inicio: mostrarInicio,
    tienda: () => mostrarCatalogo(ruta),
    categoria: () => mostrarCatalogo(ruta),
    busqueda: () => mostrarCatalogo(ruta),
    producto: () => mostrarProducto(ruta.params.get('id') || 1),
    carrito: mostrarCarrito,
    checkout: mostrarPago,
    confirmacion: mostrarConfirmacion,
    login: mostrarAcceso,
    cuenta: () => mostrarCuenta(),
    direcciones: () => mostrarCuenta(true),
    pedidos: () => mostrarPedidos(ruta),
    seguimiento: () => mostrarSeguimiento(ruta),
    favoritos: mostrarFavoritos,
    nosotros: mostrarNosotros,
    ayuda: () => mostrarAyuda(ruta),
  };
  $('#app').innerHTML = (views[ruta.name] || mostrarInicio)();
  actualizarSeleccion();
  actualizarCategoriasAyuda();
  $('#app').setAttribute('aria-busy', 'false');
  const titulos = {
    inicio: 'El sabor de nuestra tierra',
    tienda: 'Nuestra tienda',
    categoria: 'Productos de Loja',
    busqueda: 'Buscar',
    producto: 'Detalle de producto',
    carrito: 'Tu carrito',
    checkout: 'Compra segura',
    confirmacion: 'Gracias por tu compra',
    login: 'Tu cuenta',
    cuenta: 'Mi perfil',
    direcciones: 'Direcciones',
    pedidos: 'Mis pedidos',
    seguimiento: 'Consultar pedido',
    favoritos: 'Mis favoritos',
    nosotros: 'Nuestra historia',
    ayuda: 'Ayuda y contacto',
  };
  document.title = (titulos[ruta.name] || 'Inicio') + ' | Café Mercadillo';
}

function cambiarRuta() {
  const ruta = obtenerRuta();
  if (ruta.name !== 'login' && location.hash.slice(1) !== returnTo) favoritoPendiente = null;
  page = 1;
  helpCategory = '';
  filters = crearFiltrosIniciales();
  mostrarPagina();
  window.scrollTo(0, 0);
}

async function iniciarAplicacion() {
  try {
    await cargarPlantillas();
    mostrarPagina();
  } catch (error) {
    $('#app').setAttribute('aria-busy', 'false');
    $('#app').innerHTML = html`
      <div class="wrap empty" role="alert">
        <h1 class="page-title">No se pudo abrir la tienda</h1>
        <p>Comprueba tu conexión y vuelve a cargar la página.</p>
        <p>Si estás probando los archivos en tu equipo, abre la web desde el servidor local.</p>
        <a class="btn" href="">Volver a cargar</a>
      </div>
    `;
    console.error(error);
  }
}

window.addEventListener('hashchange', cambiarRuta);

async function cargarPlantillas() {
  const archivos = [
    'encabezado',
    'pie',
    'tarjeta-producto',
    'inicio',
    'catalogo',
    'producto-vacio',
    'producto',
    'resumen',
    'carrito',
    'pago',
    'detalle-pedido',
    'confirmacion-vacio',
    'confirmacion',
    'acceso',
    'menu-cuenta',
    'cuenta-vacio',
    'cuenta',
    'pedidos',
    'favoritos-vacio',
    'favoritos',
    'nosotros',
    'ayuda',
  ];
  await Promise.all(
    archivos.map(async (nombre) => {
      const respuesta = await fetch('plantillas/' + nombre + '.html');
      if (!respuesta.ok) throw new Error('No se pudo cargar ' + nombre);
      plantillas.set(nombre, await respuesta.text());
    }),
  );
}
iniciarAplicacion();
