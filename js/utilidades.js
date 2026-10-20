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

const crearBoton = (t, u, secondary = false) => html`
    <a class="btn ${secondary ? 'secondary' : ''}" href="#${u}">${t}</a>
  `,
  crearRuta = (s) => html`
    <div class="crumb">
      <a href="#inicio">Inicio</a>
      / ${s}
    </div>
  `;

function crearCampo(label, name, type = 'text', value = '', required = true) {
  return html`
    <label>
      ${label}
      <input
        name="${name}"
        type="${type}"
        value="${escaparTexto(value)}"
        ${required ? 'required' : ''}
        ${type === 'email' ? 'pattern="[^\\s@]+@[^\\s@]+[.][^\\s@]+" autocomplete="email"' : type === 'tel' ? 'pattern="[0-9]{10}" inputmode="numeric" minlength="10" title="Ingresa exactamente 10 dígitos"' : type === 'password' ? 'minlength="6" title="Mínimo 6 caracteres"' : ''}
        maxlength="${type === 'tel' ? 10 : type === 'password' ? 100 : 150}"
      />
    </label>
  `;
}
