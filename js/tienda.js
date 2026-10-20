'use strict';

function mostrarInicio() {
  return plantilla('inicio', {
    botonTienda: crearBoton('Comprar ahora →', 'tienda'),
    botonHistoria: crearBoton('Conocer nuestra historia', 'nosotros', true),
    imagenPortada: imgs.cup,
    categorias: [
      ['Café', imgs.beans],
      ['Dulces', imgs.sweets],
      ['Tradicionales', imgs.food],
      ['Regalos', imgs.gift],
    ]
      .map(
        ([n, img]) => html`
          <a class="category" href="#categoria?tipo=${n}">
            <img src="${img}" alt="${n}" loading="lazy" />
            <span>${n === 'Tradicionales' ? 'Productos tradicionales' : n} ↗</span>
          </a>
        `,
      )
      .join(''),
    destacados: crearSeccionProductos('Productos destacados', products.slice(0, 4)),
    imagenOrigen: imgs.land,
    botonOrigen: crearBoton('Conoce nuestra historia →', 'nosotros', true),
    masVendidos: crearSeccionProductos('Los más vendidos', products.slice(4, 8)),
    beneficios: [
      ['◇ Producto lojano', 'Raíces que nos llenan de orgullo'],
      ['✦ Calidad seleccionada', 'Cuidamos cada pequeño detalle'],
      ['♧ Compra segura', 'Una experiencia sencilla'],
      ['↗ Envíos nacionales', 'Loja, más cerca de ti'],
    ]
      .map(
        ([t, d]) => html`
          <div>
            <strong>${t}</strong>
            <span>${d}</span>
          </div>
        `,
      )
      .join(''),
    opiniones: [
      ['María P.', 'Un aroma delicioso. Me recuerda al café que preparábamos en casa.'],
      ['Andrés V.', 'La selección de productos lojanos es perfecta para regalar.'],
      ['Daniela R.', 'Una forma muy bonita de disfrutar los sabores de nuestra tierra.'],
    ]
      .map(
        ([n, t]) => html`
          <article class="panel">
            <div class="stars" aria-label="5 de 5 estrellas">★★★★★</div>
            <p>“${t}”</p>
            <strong>${n}</strong>
            <p class="small-text">Amante del café</p>
          </article>
        `,
      )
      .join(''),
  });
}

function mostrarCatalogo(r) {
  const category = r.name === 'categoria' ? r.params.get('tipo') || 'Café' : '',
    query = r.name === 'busqueda' ? r.params.get('q') || '' : '';
  let list = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!query ||
        `${p.name} ${p.category} ${p.origin}`.toLowerCase().includes(query.toLowerCase())) &&
      (!filters.category || p.category === filters.category) &&
      p.price <= filters.price &&
      (!filters.presentation || p.presentation === filters.presentation) &&
      (!filters.origin || p.origin === filters.origin) &&
      (!filters.roast || p.roast === filters.roast) &&
      (!filters.weight || p.category === 'Café') &&
      (!filters.stock || p.stock),
  );
  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(list.length / 9));
  page = Math.min(page, pages);
  return plantilla('catalogo', {
    ruta: crearRuta(
      category
        ? html`
            <a href="#tienda">Tienda</a>
            / ${escaparTexto(category)}
          `
        : r.name === 'busqueda'
          ? 'Búsqueda'
          : 'Tienda',
    ),
    buscador:
      r.name === 'busqueda'
        ? html`
            <form class="searchbar" data-form="search">
              <input
                name="q"
                type="search"
                value="${escaparTexto(query)}"
                placeholder="Busca tu próximo favorito"
                aria-label="Buscar productos"
              />
              <button class="btn">Buscar</button>
            </form>
          `
        : '',
    titulo: category
      ? html`
          <div class="banner">
            <div class="eyebrow">SABORES CON ORIGEN</div>
            <h1>${category === 'Café' ? 'Café lojano' : escaparTexto(category)}</h1>
            <p>
              ${category === 'Café' ? 'Descubre café de Mercadillo y Alamor, dos pueblos vecinos de Loja.' : 'Pequeños tesoros de nuestra tierra, para disfrutar y compartir.'}
            </p>
          </div>
        `
      : html`
          <h1 class="page-title">
            ${r.name === 'busqueda' ? (query ? `Resultados para “${escaparTexto(query)}”` : 'Encuentra tu favorito') : 'Nuestra tienda'}
          </h1>
          <p>Café de origen y sabores tradicionales. De Loja, para ti.</p>
        `,
    subcategorias:
      category === 'Café'
        ? html`
            <div class="chips">
              ${['En grano', 'Molido', 'Especial', 'Packs']
                .map(
                  (n) => html`
                    <button
                      class="chip ${filters.presentation === n ? 'active' : ''}"
                      data-action="subcategory"
                      data-value="${n}"
                    >
                      ${n}
                    </button>
                  `,
                )
                .join('')}
            </div>
          `
        : '',
    cantidadResultados: list.length,
    opcionesOrden: [
      ['recommended', 'Recomendados'],
      ['low', 'Precio: menor a mayor'],
      ['high', 'Precio: mayor a menor'],
      ['name', 'Nombre'],
    ]
      .map(
        ([v, t]) => html`
          <option value="${v}" ${sort === v ? 'selected' : ''}>${t}</option>
        `,
      )
      .join(''),
    filtroCategoria: !category
      ? crearFiltro('Categoría', 'category', ['Café', 'Dulces', 'Tradicionales', 'Regalos'])
      : '',
    precioMaximo: formatearPrecio(filters.price),
    valorPrecio: filters.price,
    filtroPresentacion: crearFiltro('Presentación / molienda', 'presentation', [
      'En grano',
      'Molido',
    ]),
    filtroOrigen: crearFiltro('Origen', 'origin', ['Mercadillo', 'Alamor']),
    filtrosCafe:
      category === 'Café'
        ? crearFiltro('Tostado', 'roast', ['Medio', 'Oscuro']) +
          crearFiltro('Peso', 'weight', ['250 g', '450 g', '900 g'])
        : '',
    soloDisponibles: filters.stock ? 'checked' : '',
    productos: list.length
      ? crearCuadricula(list.slice((page - 1) * 9, page * 9))
      : html`
          <div class="empty">
            <div class="big-icon">⌕</div>
            <h2>No encontramos productos</h2>
            <p>Prueba otra búsqueda o explora nuestro catálogo.</p>
            <button class="btn" data-action="reset-catalog">Ver todos los productos</button>
          </div>
        `,
    paginacion: list.length
      ? html`
          <nav class="pagination" aria-label="Paginación">
            <button
              class="chip"
              data-action="page"
              data-value="${page - 1}"
              ${page === 1 ? 'disabled' : ''}
            >
              Anterior
            </button>
            ${Array.from(
              { length: pages },
              (_, i) => html`
                <button
                  class="chip ${page === i + 1 ? 'active' : ''}"
                  data-action="page"
                  data-value="${i + 1}"
                  aria-label="Página ${i + 1}"
                >
                  ${i + 1}
                </button>
              `,
            ).join('')}
            <button
              class="chip"
              data-action="page"
              data-value="${page + 1}"
              ${page === pages ? 'disabled' : ''}
            >
              Siguiente
            </button>
          </nav>
        `
      : '',
    recomendados: !list.length
      ? crearSeccionProductos('Productos que podrían interesarte', products.slice(0, 4))
      : '',
    informacionCafe:
      category === 'Café'
        ? html`
            <section class="section banner">
              <h2>Conoce el café lojano</h2>
              <p>
                La altura, el clima y el cuidado en el tostado dan lugar a perfiles aromáticos que
                invitan a disfrutar cada taza.
              </p>
              ${crearBoton('Leer más', 'nosotros', true)}
            </section>
          `
        : '',
  });
}

function mostrarProducto(id) {
  const p = products.find((p) => p.id === Number(id));
  if (!p)
    return plantilla('producto-vacio', { contenido1: crearBoton('Volver a la tienda', 'tienda') });
  return plantilla('producto', {
    ruta: crearRuta(html`
      <a href="#categoria?tipo=${p.category}">${p.category}</a>
      / ${p.name}
    `),
    imagen: p.image,
    nombreImagen: p.name,
    miniaturas: [p.image, imgs.cup, imgs.beans]
      .map(
        (im, i) => html`
          <button data-action="gallery" data-src="${im}" aria-label="Ver fotografía ${i + 1}">
            <img src="${im}" alt="Vista ${i + 1}" loading="lazy" />
          </button>
        `,
      )
      .join(''),
    origen: p.origin,
    nombre: p.name,
    precioUnitario: formatearPrecio(p.price),
    disponibilidad: p.stock ? '● Disponible' : 'Agotado temporalmente',
    presentaciones: (p.category === 'Café' ? ['Molido', 'En grano'] : ['Unidad'])
      .map(
        (v) => html`
          <option>${v}</option>
        `,
      )
      .join(''),
    pesos: (p.category === 'Café' ? ['250 g', '450 g', '900 g'] : [p.weight])
      .map(
        (w) => html`
          <option>${w}</option>
        `,
      )
      .join(''),
    molienda:
      p.category === 'Café'
        ? html`
            <label class="spaced-field">
              Tipo de molienda
              <select id="grind">
                <option>Media · filtrado</option>
                <option>Fina · espresso</option>
                <option>Gruesa · prensa francesa</option>
                <option>Sin molienda</option>
              </select>
            </label>
          `
        : '',
    total: formatearPrecio(p.price),
    idCompra: p.id,
    estadoCompra: p.stock ? '' : 'disabled',
    idFavorito: p.id,
    textoFavorito: favorites.includes(p.id) ? '♥ Guardado' : '♡ Añadir a favoritos',
    caracteristicas: [
      ['Descripción', 'Una selección artesanal para disfrutar el sabor y la tradición lojana.'],
      ['Origen', `Origen de referencia: ${p.origin}, provincia de Loja, Ecuador.`],
      [
        'Características',
        `${p.category === 'Café' ? 'Tostado ' + p.roast.toLowerCase() + ', perfil equilibrado y notas aromáticas.' : 'Producto tradicional seleccionado.'} Presentación: ${p.weight}.`,
      ],
      [
        'Preparación recomendada',
        'Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.',
      ],
      [
        'Conservación',
        'Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.',
      ],
    ]
      .map(
        ([t, c]) => html`
          <details>
            <summary>${t}</summary>
            <p>${c}</p>
          </details>
        `,
      )
      .join(''),
    perfilCafe:
      p.category === 'Café'
        ? html`
            <section class="section">
              <h2>Perfil del café</h2>
              <p class="demo-note">Escala ilustrativa de intensidad de 1 a 5.</p>
              <div class="profile-bars">
                ${[
                  ['Aroma', 5],
                  ['Cuerpo', 4],
                  ['Dulzor', 4],
                  ['Acidez', 3],
                  ['Tostado', 3],
                ]
                  .map(
                    ([atributo, intensidad]) => html`
                      <label class="coffee-attribute">
                        <span class="coffee-attribute-title">
                          <span>${atributo}</span>
                          <strong>${intensidad}/5</strong>
                        </span>
                        <meter min="0" max="5" value="${intensidad}">${intensidad}/5</meter>
                      </label>
                    `,
                  )
                  .join('')}
              </div>
            </section>
          `
        : '',
    relacionados: crearSeccionProductos(
      'También te puede gustar',
      products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4),
    ),
  });
}

function calcularPrecioVariante(p, presentation = p.presentation, weight = p.weight) {
  const multiplier = { '250 g': 1, '450 g': 1.8, '900 g': 3.6 };
  return (
    Math.round(
      p.price *
        (p.category === 'Café' ? multiplier[weight] || 1 : 1) *
        (p.category === 'Café' && presentation === 'En grano' ? 1.05 : 1) *
        100,
    ) / 100
  );
}

function actualizarSeleccion() {
  const p = buscarProducto(obtenerRuta().params.get('id') || 1);
  if (!p || !$('#unit-price')) return;
  const presentation = $('#presentation').value,
    weight = $('#weight').value,
    price = calcularPrecioVariante(p, presentation, weight);
  $('#unit-price').textContent = formatearPrecio(price);
  $('#selection-total').textContent = formatearPrecio(
    price * Math.max(1, Number($('#product-qty').value) || 1),
  );
  const descripcion = $('#price-description');
  const descripcionCantidad = $('#quantity-description');
  const cantidad = Math.max(1, Number($('#product-qty').value) || 1);
  if (descripcion) {
    descripcion.textContent =
      p.category === 'Café'
        ? `Por bolsa de ${weight} · ${presentation.toLowerCase()} · precio de demostración`
        : 'Por unidad · precio de demostración';
  }
  if (descripcionCantidad) {
    descripcionCantidad.textContent = `Total por ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'}`;
  }
  const grind = $('#grind');
  if (grind) {
    grind.disabled = presentation === 'En grano';
    if (grind.disabled) grind.value = 'Sin molienda';
    else if (grind.value === 'Sin molienda') grind.value = 'Media · filtrado';
  }
}

function mostrarFavoritos() {
  if (!profile)
    return plantilla('favoritos-vacio', { contenido1: crearBoton('Iniciar sesión', 'login') });
  return plantilla('favoritos', {
    ruta: crearRuta('Favoritos'),
    productos: favorites.length
      ? crearCuadricula(products.filter((p) => favorites.includes(p.id)))
      : html`
          <div class="empty">
            <div class="big-icon">♡</div>
            <h2>Aún no tienes productos favoritos.</h2>
            <p>Guarda productos para encontrarlos fácilmente después.</p>
            ${crearBoton('Explorar productos', 'tienda')}
          </div>
        `,
  });
}

function mostrarNosotros() {
  return plantilla('nosotros', {
    ruta: crearRuta('Nosotros'),
    botonTienda: crearBoton('Descubre nuestros productos →', 'tienda'),
    imagenOrigen: imgs.land,
    imagenCafe: imgs.coffee,
    productores: [
      ['Cultivadores', 'Mercadillo', 'El cuidado empieza en la tierra.'],
      ['Recolectores', 'Alamor', 'La selección se hace con atención y experiencia.'],
      ['Tostadores', 'Mercadillo', 'El tostado revela los aromas de cada grano.'],
    ]
      .map(
        ([n, l, d]) => html`
          <article class="panel">
            <img
              class="producer-image"
              src="${imgs[n === 'Tostadores' ? 'beans' : 'land']}"
              alt="${n === 'Tostadores' ? 'Granos de café' : 'Entorno natural del cultivo'}"
              loading="lazy"
            />
            <h3>${n}</h3>
            <div class="eyebrow">${l}</div>
            <p>${d}</p>
          </article>
        `,
      )
      .join(''),
    proceso: ['Cultivo', 'Recolección', 'Selección', 'Tostado', 'Tu taza']
      .map(
        (n, i) => html`
          <span>
            <small>0${i + 1}</small>
            <br />
            <strong>${n}</strong>
          </span>
        `,
      )
      .join('<span aria-hidden="true">→</span>'),
    valores: [
      ['Tradición', 'Sabores con memoria.'],
      ['Calidad', 'Atención en cada selección.'],
      ['Comercio local', 'Conexión con nuestra comunidad.'],
      ['Sostenibilidad', 'Respeto por nuestra tierra.'],
    ]
      .map(
        ([n, d]) => html`
          <div class="panel">
            <h3>${n}</h3>
            <p>${d}</p>
          </div>
        `,
      )
      .join(''),
    botonProductos: crearBoton('Descubre nuestros productos', 'tienda'),
  });
}
