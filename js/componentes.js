'use strict';

function obtenerSeccionActiva(ruta) {
  if (ruta.name === 'categoria') {
    const categoria = ruta.params.get('tipo') || 'Café';
    return categoria === 'Café' ? 'categoria' : 'categoria?tipo=Tradicionales';
  }

  if (ruta.name === 'producto') {
    const producto = buscarProducto(ruta.params.get('id') || 1);
    return producto?.category === 'Café' ? 'categoria' : 'categoria?tipo=Tradicionales';
  }

  if (ruta.name === 'busqueda') return 'tienda';

  return ruta.name;
}

function mostrarEncabezado() {
  const ruta = obtenerRuta();
  const active = obtenerSeccionActiva(ruta);
  const simple = ['checkout', 'confirmacion', 'login'].includes(ruta.name);
  $('#header').innerHTML = plantilla('encabezado', {
    contenido1: logo,
    contenido2: simple
      ? '<span>♧ Compra segura</span>'
      : html`
          <nav id="main-navigation" class="navlinks" aria-label="Navegación principal">
            ${[
              ['inicio', 'Inicio'],
              ['tienda', 'Tienda'],
              ['categoria', 'Café'],
              ['categoria?tipo=Tradicionales', 'Productos Lojanos'],
              ['nosotros', 'Nosotros'],
              ['ayuda', 'Ayuda'],
            ]
              .map(
                ([u, t]) => html`
                  <a
                    href="#${u}"
                    class="${active === u ? 'active' : ''}"
                    ${active === u ? 'aria-current="page"' : ''}
                  >
                    ${t}
                  </a>
                `,
              )
              .join('')}
          </nav>
        `,
    contenido3: simple
      ? ''
      : html`
          <a class="icon" href="#busqueda" aria-label="Buscar">${icon('search')}<span class="sr-only">Buscar</span></a>
          <a class="icon" href="#favoritos" aria-label="Favoritos">
            <span class="sr-only">Favoritos</span>
            ${icon('heart')}${
              favorites.length
                ? html`
                    <span class="badge">${favorites.length}</span>
                  `
                : ''
            }
          </a>
          <a class="icon" href="#${profile ? 'cuenta' : 'login'}" aria-label="Mi cuenta">
            <span class="sr-only">Mi cuenta</span>
            ${icon('user')}
          </a>
        `,
    contenido4: icon('bag'),
    contenido5: cart.length
      ? html`
          <span class="badge">${cart.reduce((s, p) => s + p.qty, 0)}</span>
        `
      : '',
    contenido6: simple
      ? ''
      : html`
          <button
            class="icon mobile-menu"
            data-action="menu"
            aria-label="Abrir navegación"
            aria-expanded="false"
            aria-controls="main-navigation"
          >
            ${icon('menu')}
          </button>
        `,
  });
}

function mostrarPie() {
  const simple = ['checkout', 'login'].includes(obtenerRuta().name);
  $('#footer').innerHTML = plantilla('pie', {
    contenido1: simple
      ? ''
      : html`
          <div class="footer-grid">
            <div>
              ${logo}
              <p>
                El sabor de nuestra tierra,
                <br />
                el cariño de nuestra gente.
              </p>
            </div>
            <div>
              <h2>Explora Mercadillo</h2>
              <a href="#tienda">Nuestra tienda</a>
              <a href="#categoria">Café lojano</a>
              <a href="#categoria?tipo=Tradicionales">Productos lojanos</a>
              <a href="#nosotros">Nuestra historia</a>
            </div>
            <div>
              <h2>Estamos para ayudarte</h2>
              <a href="#seguimiento">Consultar un pedido</a>
              <a href="#ayuda">Preguntas frecuentes</a>
              <a href="#ayuda?tema=Envíos">Envíos y entregas</a>
              <a href="#ayuda?tema=Devoluciones">Devoluciones</a>
              <a href="#ayuda?tema=Cuenta">Términos y privacidad</a>
            </div>
            <div>
              <h2>Hablemos</h2>
              <p>
                Loja, Ecuador
                <br />
                Lunes a viernes · 09:00–18:00
              </p>
              <a href="#ayuda">Contáctanos →</a>
              <p>Catálogo y datos de demostración</p>
            </div>
          </div>
        `,
    contenido2: new Date().getFullYear(),
  });
}

function crearTarjetaProducto(p) {
  return plantilla('tarjeta-producto', {
    claseFavorito: favorites.includes(p.id) ? 'selected' : '',
    id: p.id,
    accionFavorito: favorites.includes(p.id) ? 'Eliminar de' : 'Añadir a',
    nombre: p.name,
    favoritoActivo: favorites.includes(p.id),
    iconoFavorito: favorites.includes(p.id) ? '♥' : '♡',
    idEnlace: p.id,
    imagen: p.image,
    textoAlternativo: p.name,
    origen: p.origin.toUpperCase(),
    peso: p.weight.toUpperCase(),
    idTitulo: p.id,
    titulo: p.name,
    precio: formatearPrecio(p.price),
    descripcionPrecio: p.category === 'Café' ? 'Por bolsa de 250 g · molido' : 'Por unidad',
    idCompra: p.id,
    disponibilidad: p.stock ? '' : 'disabled',
    textoCompra: p.stock ? 'Añadir al carrito' : 'Agotado',
    botonDetalles: crearBoton('Ver detalles', `producto?id=${p.id}`, true, `Ver detalles de ${p.name}`),
  });
}

const crearCuadricula = (ps) => html`
    <div class="grid">${ps.map(crearTarjetaProducto).join('')}</div>
  `,
  crearSeccionProductos = (t, ps) => html`
    <section class="section">
      <div class="section-head">
        <h2>${t}</h2>
        <a class="text-link" href="#tienda">Ver todos los productos ↗</a>
      </div>
      ${crearCuadricula(ps)}
    </section>
  `;

function crearFiltro(label, key, options) {
  return html`
    <label>
      ${label}
      <select data-filter="${key}">
        <option value="">Todos</option>
        ${options
          .map(
            (o) => html`
              <option ${filters[key] === o ? 'selected' : ''}>${o}</option>
            `,
          )
          .join('')}
      </select>
    </label>
  `;
}

function crearMenuCuenta(active) {
  return plantilla('menu-cuenta', {
    opciones: [
      ['cuenta', 'Mi perfil'],
      ['direcciones', 'Direcciones'],
      ['pedidos', 'Mis pedidos'],
      ['favoritos', 'Favoritos'],
    ]
      .map(
        ([r, t]) => html`
          <a class="${active === r ? 'active' : ''}" href="#${r}" ${active === r ? 'aria-current="page"' : ''}>${t}</a>
        `,
      )
      .join(''),
  });
}
