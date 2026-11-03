'use strict';

const precioLinea = (c) => c.unitPrice ?? buscarProducto(c.id)?.price ?? 0;

const subtotalCarrito = () => cart.reduce((s, c) => s + precioLinea(c) * c.qty, 0);

function crearResumen(mostrarPago = false) {
  const sub = subtotalCarrito(),
    shipping = sub >= 35 || !cart.length ? 0 : 3.5,
    discount = coupon ? sub * 0.1 : 0;
  return plantilla('resumen', {
    titulo: mostrarPago ? 'Tu pedido' : 'Resumen de compra',
    productos: mostrarPago
      ? cart
          .map(
            (c) => html`
              <div class="sumrow">
                <span>${escaparTexto(buscarProducto(c.id)?.name || 'Producto')} × ${c.qty}</span>
                <span>${formatearPrecio(precioLinea(c) * c.qty)}</span>
              </div>
            `,
          )
          .join('')
      : '',
    subtotal: formatearPrecio(sub),
    envio: shipping ? formatearPrecio(shipping) : 'Gratis',
    descuento: formatearPrecio(discount),
    total: formatearPrecio(sub + shipping - discount),
    acciones: mostrarPago
      ? '<button class="btn full" type="submit" form="checkout-form">Realizar pedido de prueba →</button>'
      : html`
          <div class="buttons">
            ${crearBoton('Continuar al pago →', 'checkout')}${crearBoton('Seguir comprando', 'tienda', true)}
          </div>
          <p class="demo-note">Los precios y existencias se confirman al registrar el pedido.</p>
        `,
  });
}

function mostrarCarrito() {
  return plantilla('carrito', {
    ruta: crearRuta('Carrito'),
    contenido: !cart.length
      ? html`
          <div class="empty">
            <div class="big-icon">♧</div>
            <h2>Tu próxima taza te espera</h2>
            <p>Aún no tienes productos en tu carrito.</p>
            ${crearBoton('Explorar productos', 'tienda')}
          </div>
        `
      : html`
          <div class="two-col">
            <div>
              <h2>Productos en tu carrito</h2>
              ${cart
                .map((c, i) => {
                  const p = buscarProducto(c.id);
                  return html`
                    <article class="cart-row">
                      <img src="${escaparTexto(p.image)}" alt="${escaparTexto(p.name)}" />
                      <div class="info">
                        <h3 class="cart-product-title">
                          <a href="#producto?id=${p.id}">${escaparTexto(p.name)}</a>
                        </h3>
                        <p class="cart-product-description">
                          ${escaparTexto(c.presentation)} ·
                          ${escaparTexto(c.weight || p.weight)}${c.grind ? ' · ' + escaparTexto(c.grind) : ''}
                        </p>
                        <button class="chip" data-action="remove-cart" data-index="${i}" aria-label="Eliminar ${escaparTexto(p.name)}, ${escaparTexto(c.weight || p.weight)}, ${escaparTexto(c.presentation)}">
                          Eliminar
                        </button>
                      </div>
                      <div class="qty">
                        <button
                          data-action="quantity"
                          data-index="${i}"
                          data-value="-1"
                          aria-label="Reducir cantidad de ${escaparTexto(p.name)}, ${escaparTexto(c.weight || p.weight)}, ${escaparTexto(c.presentation)}"
                        >
                          −
                        </button>
                        <span>${c.qty}</span>
                        <button
                          data-action="quantity"
                          data-index="${i}"
                          data-value="1"
                          aria-label="Aumentar cantidad de ${escaparTexto(p.name)}, ${escaparTexto(c.weight || p.weight)}, ${escaparTexto(c.presentation)}"
                        >
                          +
                        </button>
                      </div>
                      <strong>${formatearPrecio(precioLinea(c) * c.qty)}</strong>
                    </article>
                  `;
                })
                .join('')}
            </div>
            ${crearResumen()}
          </div>
        `,
  });
}

function mostrarPago() {
  if (!profile) return plantilla('cuenta-vacio', { contenido1: crearBoton('Iniciar sesión para comprar', 'login') });
  if (!cart.length) return mostrarCarrito();
  return plantilla('pago', {
    ruta: crearRuta('Carrito / Pago'),
    nombre: crearCampo('Nombre', 'name', 'text', profile?.name || ''),
    apellido: crearCampo('Apellido', 'surname', 'text', profile?.surname || ''),
    correo: crearCampo('Correo electrónico', 'email', 'email', profile?.email || ''),
    telefono: crearCampo('Teléfono', 'phone', 'tel', profile?.phone || ''),
    ubicacion: crearUbicacion(),
    direccion: crearCampo('Dirección', 'address'),
    referencia: crearCampo('Referencia', 'reference', 'text', '', false),
    resumen: crearResumen(true),
    metodos: metodosPago.map((m, indice) => `<label class="radio-option"><input type="radio" name="payment" value="${escaparTexto(m.met_codigo__)}" ${indice === 0 ? 'checked' : ''} required>${escaparTexto(m.met_nombre__)}</label>`).join(''),
  });
}

function crearUbicacion() {
  return html`
    <label>Provincia
      <select name="province" id="province" autocomplete="address-level1" required>
        <option value="">--Seleccione una provincia--</option>
        ${Object.keys(provinceCities).sort().map((provincia) => `<option>${provincia}</option>`).join('')}
      </select>
    </label>
    <label>Ciudad
      <select name="city" id="city" autocomplete="address-level2" required disabled>
        <option value="">--Seleccione una ciudad--</option>
      </select>
    </label>
  `;
}

function crearDetallePedido(o) {
  return plantilla('detalle-pedido', {
    numero: escaparTexto(o.number),
    estado: escaparTexto(o.status),
    fecha: new Date(o.date).toLocaleDateString('es-EC'),
    pago: escaparTexto(o.payment) + ' · Estado del pago: ' + escaparTexto(o.paymentStatus || 'PENDIENTE'),
    productos: o.items
      .map((c) => {
        const p = c.name ? { name: c.name, image: c.image, weight: c.weight } : buscarProducto(c.id) || { name: 'Producto', image: 'favicon.svg', weight: '' };
        return html`
          <div class="cart-row">
            <img src="${escaparTexto(p.image)}" alt="${escaparTexto(p.name)}" />
            <div class="info">
              <strong>${escaparTexto(p.name)}</strong>
              <p>
                ${escaparTexto(c.presentation)} · ${escaparTexto(c.weight || p.weight)} · Cantidad:
                ${c.qty}
              </p>
            </div>
            <strong>${formatearPrecio(precioLinea(c) * c.qty)}</strong>
          </div>
        `;
      })
      .join(''),
    direccion: escaparTexto(o.address),
    ciudad: escaparTexto(o.city),
    total: formatearPrecio(o.total),
    progreso: crearProgresoPedido(o.status) + (o.tracking?.length ? '<ul>' + o.tracking.map((t) => '<li>' + escaparTexto(t.fecha) + ': ' + escaparTexto(t.estado) + '</li>').join('') + '</ul>' : ''),
  });
}

function crearProgresoPedido(estado) {
  const etapas = ['Recibido', 'Preparando', 'Enviado', 'Entregado'];
  const actual = etapas.indexOf(estado);
  return html`
    <ol class="steps order-progress" aria-label="Seguimiento del pedido">
      ${etapas.map((etapa, indice) => html`
        <li class="${indice === actual ? 'active' : ''}" ${indice === actual ? 'aria-current="step"' : ''}>
          ${etapa}
          <span class="sr-only">${indice === actual ? 'Estado actual' : indice < actual ? 'Completado' : 'Pendiente'}</span>
        </li>
      `).join('')}
    </ol>
  `;
}

function mostrarConfirmacion() {
  if (!lastOrder)
    return plantilla('confirmacion-vacio', {
      contenido1: crearBoton('Explorar productos', 'tienda'),
    });
  return plantilla('confirmacion', {
    numero: lastOrder.number,
    detalle: crearDetallePedido(lastOrder),
    botonPedido: crearBoton('Ver mi pedido', `seguimiento?id=${lastOrder.number}`),
    botonTienda: crearBoton('Seguir comprando', 'tienda', true),
  });
}

function mostrarPedidos(r) {
  if (!profile) return mostrarSeguimiento(r);
  const owned = orders.filter((o) => o.owner === profile.email.toLowerCase()),
    selected = owned.find((o) => String(o.number) === r.params.get('id')),
    list = owned.filter(
      (o) =>
        orderFilter === 'Todos' ||
        (orderFilter === 'En proceso'
          ? ['Recibido', 'Preparando'].includes(o.status)
          : o.status === { Enviados: 'Enviado', Entregados: 'Entregado' }[orderFilter]),
    );
  return plantilla('pedidos', {
    ruta: crearRuta('Mi cuenta / Mis pedidos'),
    menu: crearMenuCuenta('pedidos'),
    contenido: selected
      ? `${crearBoton('← Todos los pedidos', 'pedidos', true)}${crearDetallePedido(selected)}`
      : html`
          <div class="chips">
            ${['Todos', 'En proceso', 'Enviados', 'Entregados']
              .map(
                (t) => html`
                  <button
                    class="chip ${t === orderFilter ? 'active' : ''}"
                    data-action="order-filter"
                    data-value="${t}"
                    aria-pressed="${t === orderFilter}"
                  >
                    ${t}
                  </button>
                `,
              )
              .join('')}
          </div>
          ${
            list.length
              ? list
                  .map(
                    (o) => html`
                      <article class="panel order">
                        <div class="order-head">
                          <h3>Pedido #${o.number}</h3>
                          <span class="status">${o.status}</span>
                        </div>
                        <p>
                          ${new Date(o.date).toLocaleDateString('es-EC')} ·
                          ${o.items.reduce((s, i) => s + i.qty, 0)} productos
                        </p>
                        <div class="order-head">
                          <strong>Total: ${formatearPrecio(o.total)}</strong>
                          ${crearBoton('Ver detalle', `pedidos?id=${o.number}`, true, `Ver detalle del pedido ${o.number}`)}
                        </div>
                      </article>
                    `,
                  )
                  .join('')
              : html`
                  <div class="empty">
                    <h2>No hay pedidos en esta sección</h2>
                    <p>Tus pedidos aparecerán aquí cuando completes una compra de prueba.</p>
                    ${crearBoton('Explorar productos', 'tienda')}
                  </div>
                `
          }
        `,
  });
}

function mostrarSeguimiento(r) {
  if (!profile) return plantilla('cuenta-vacio', { contenido1: crearBoton('Iniciar sesión para consultar pedidos', 'login') });
  return html`
      <div class="wrap narrow">
      ${crearRuta('Consultar pedido')}
      <h1 class="page-title">Consulta tu pedido</h1>
      <p>
        Consulta los pedidos de tu cuenta mediante su número y tu correo.
      </p>
      <form class="panel" data-form="tracking">
        ${crearCampo('Número de pedido', 'number', 'text', r.params.get('id') || '')}
        ${crearCampo('Correo de la compra', 'email', 'email')}
        <button class="btn full" type="submit">Consultar estado</button>
      </form>
      <p class="demo-note">Tus pedidos se guardan en tu cuenta y se pueden consultar desde otros dispositivos.</p>
      <p id="tracking-status" role="status" aria-live="polite" aria-atomic="true"></p>
      <div id="tracking-result"></div>
      </div>
  `;
}
