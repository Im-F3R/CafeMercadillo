'use strict';

const plantillas = new Map();

function html(fragmentos, ...valores) {
  return fragmentos.reduce((resultado, texto, indice) => {
    return resultado + texto + (valores[indice] ?? '');
  }, '');
}

function plantilla(nombre, valores = {}) {
  const contenido = plantillas.get(nombre);
  if (contenido === undefined) throw new Error('No se ha cargado la plantilla ' + nombre);

  return contenido.replace(/{{(\w+)}}/g, (coincidencia, clave) => {
    return String(valores[clave] ?? '');
  });
}

const $ = (s) => document.querySelector(s),
  formatearPrecio = (n) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n),
  escaparTexto = (s) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );

function mostrarMensaje(s) {
  $('#toast').textContent = s;
  $('#toast').classList.add('visible');
  clearTimeout(mostrarMensaje.timer);
  mostrarMensaje.timer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
}

function crearBoton(texto, destino, secundario = false, nombreAccesible = '') {
  return html`
    <a class="btn ${secundario ? 'secondary' : ''}" href="#${destino}"
      ${nombreAccesible ? `aria-label="${escaparTexto(nombreAccesible)}"` : ''}>${texto}</a>
  `;
}

function crearRuta(texto) {
  const niveles = texto.split(/\s+\/\s+/).map((nivel) => nivel.trim());
  return html`
    <nav class="crumb" aria-label="Migas de pan">
      <ol>
        <li><a href="#inicio">Inicio</a></li>
        ${niveles.map((nivel, indice) => html`
          <li>${indice === niveles.length - 1
            ? `<span aria-current="page">${nivel.replace(/<[^>]*>/g, '')}</span>`
            : nivel}</li>
        `).join('')}
      </ol>
    </nav>
  `;
}

function crearCampo(label, name, type = 'text', value = '', required = true) {
  const autocompletar = {
    name: 'given-name', surname: 'family-name', email: 'email', phone: 'tel',
    address: 'street-address', city: 'address-level2', province: 'address-level1',
  };
  const proposito = type === 'password'
    ? (authTab === 'register' ? 'new-password' : 'current-password')
    : (autocompletar[name] || 'off');
  const ayuda = type === 'password' ? 'Mínimo 6 caracteres.' : type === 'tel' ? '10 dígitos, sin letras ni espacios.' : '';
  let restricciones = '';
  if (type === 'email') restricciones = 'pattern="[^\\s@]+@[^\\s@]+[.][^\\s@]+"';
  if (type === 'tel') restricciones = 'pattern="[0-9]{10}" inputmode="numeric" minlength="10"';
  if (type === 'password') restricciones = 'minlength="6"';
  return html`
    <label>
      ${label}
      <input
        id="campo-${name}"
        name="${name}"
        type="${type}"
        value="${escaparTexto(value)}"
        ${required ? 'required' : ''}
        autocomplete="${proposito}"
        ${restricciones}
        ${ayuda ? `aria-describedby="campo-${name}-hint"` : ''}
        maxlength="${type === 'tel' ? 10 : type === 'password' ? 100 : 150}"
      />
      ${ayuda ? `<span id="campo-${name}-hint" class="field-hint">${ayuda}</span>` : ''}
    </label>
  `;
}
