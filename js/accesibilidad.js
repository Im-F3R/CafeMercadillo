'use strict';

let filtrosAbiertos = null;
let temporizadorAnuncio;

function anunciar(texto) {
  const region = $('#accessibility-status');
  if (!region) return;

  clearTimeout(temporizadorAnuncio);
  region.textContent = '';
  temporizadorAnuncio = setTimeout(() => { region.textContent = texto; }, 60);
}

function enfocar(elemento, mantenerPosicion = true) {
  if (!elemento) return;
  if (!elemento.matches?.('a, button, input, select, textarea, [tabindex]')) {
    elemento.setAttribute('tabindex', '-1');
  }
  elemento.focus?.({ preventScroll: mantenerPosicion });
}

function enfocarTitulo() {
  enfocar($('#app h1') || $('#app'));
}

function capturarFoco() {
  const control = document.activeElement;
  if (!control || control === document.body) return null;

  return {
    id: control.id,
    nombre: control.getAttribute('name'),
    etiqueta: control.tagName,
    accion: control.dataset.action,
    indice: control.dataset.index,
    valor: control.dataset.value,
    producto: control.dataset.id,
    filtro: control.dataset.filter,
    destino: control.getAttribute('href'),
    seleccionInicio: control.selectionStart,
    seleccionFin: control.selectionEnd,
  };
}

function restaurarFoco(anterior) {
  if (!anterior) return;
  const controles = Array.from(document.querySelectorAll('a, button, input, select, textarea'));
  let control = controles.find((actual) => {
    if (anterior.id) return actual.id === anterior.id;
    if (anterior.filtro) return actual.dataset.filter === anterior.filtro;
    if (anterior.nombre) return actual.name === anterior.nombre && actual.tagName === anterior.etiqueta;
    if (anterior.accion) {
      return actual.dataset.action === anterior.accion && actual.dataset.index === anterior.indice &&
        actual.dataset.value === anterior.valor && actual.dataset.id === anterior.producto;
    }
    return anterior.destino && actual.getAttribute('href') === anterior.destino;
  });

  if (!control && anterior.indice !== undefined) {
    control = controles.filter((actual) => actual.dataset.action === anterior.accion).at(-1);
  }

  if (!control || control.disabled || control.closest('[hidden], .hidden')) {
    enfocarTitulo();
    return;
  }

  enfocar(control);
  if (typeof anterior.seleccionInicio === 'number' && control.setSelectionRange) {
    try { control.setSelectionRange(anterior.seleccionInicio, anterior.seleccionFin); } catch {}
  }
}

function actualizarPanelFiltros() {
  const panel = $('#filters');
  const boton = $('[data-action="filters"]');
  if (!panel || !boton) return;

  const abierto = filtrosAbiertos ?? window.matchMedia('(min-width: 60rem)').matches;
  panel.hidden = !abierto;
  panel.classList.toggle('open', abierto);
  boton.setAttribute('aria-expanded', String(abierto));
  boton.setAttribute('aria-controls', 'filters');
  $('.catalog')?.classList.toggle('filters-hidden', !abierto);
}

function alternarFiltros() {
  filtrosAbiertos = $('#filters').hidden;
  actualizarPanelFiltros();
}

function anunciarCatalogo() {
  const resultados = $('#catalog-count');
  if (resultados) anunciar(resultados.textContent.trim() + '. Página ' + page + '.');
}

function totalPedidoActual() {
  const subtotal = subtotalCarrito();
  return subtotal + (subtotal >= 35 || !cart.length ? 0 : 3.5) - (coupon ? subtotal * 0.1 : 0);
}

function actualizarResumenAyuda() {
  const resumen = $('#faq-count');
  if (!resumen) return;
  const cantidad = document.querySelectorAll('#faq-list details').length;
  resumen.textContent = `${cantidad} ${cantidad === 1 ? 'pregunta encontrada' : 'preguntas encontradas'}.`;
}

function alternarOpinion() {
  const formulario = $('#review-form');
  const boton = $('[data-action="review"]');
  const abrir = formulario.classList.contains('hidden');
  formulario.classList.toggle('hidden', !abrir);
  boton.setAttribute('aria-expanded', String(abrir));
  if (abrir) enfocar(formulario.querySelector('input'));
  else enfocar(boton);
}

function prepararFormularios() {
  document.querySelectorAll('form[data-form]').forEach((formulario) => {
    formulario.noValidate = true;
    formulario.querySelectorAll('input, select, textarea').forEach((control, indice) => {
      if (['hidden', 'submit', 'button'].includes(control.type)) return;
      if (!control.id) control.id = `${formulario.dataset.form}-${control.name || 'campo'}-${indice}`;
      const idError = control.id + '-error';
      if (!document.getElementById(idError)) {
        const error = document.createElement('span');
        error.id = idError;
        error.className = 'field-error';
        error.hidden = true;
        const etiqueta = control.closest('label');
        (etiqueta || control.parentElement).append(error);
      }
    });
  });
}

function mensajeValidacion(control) {
  const nombre = control.name;
  const valor = control.value.trim();

  if (control.validity.valueMissing) {
    if (control.type === 'checkbox') return 'Marca esta casilla para continuar.';
    if (nombre === 'province') return 'Selecciona una provincia.';
    if (nombre === 'city') return 'Selecciona una ciudad de la provincia elegida.';
    return 'Completa este campo.';
  }
  if (control.type === 'email' && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return 'Ingresa un correo con formato nombre@dominio.com.';
  }
  if (control.type === 'tel' && valor && !/^\d{10}$/.test(valor)) return 'Ingresa exactamente 10 dígitos, sin letras ni espacios.';
  if (control.type === 'password' && valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  if (!control.validity.valid) return 'Revisa el formato y los límites indicados para este campo.';
  return '';
}

function limpiarErrorControl(control) {
  if (!control?.id) return;
  control.removeAttribute('aria-invalid');
  const idError = control.id + '-error';
  const error = document.getElementById(idError);
  if (error) { error.textContent = ''; error.hidden = true; }
  const referencias = (control.getAttribute('aria-describedby') || '').split(' ').filter((id) => id && id !== idError);
  if (referencias.length) control.setAttribute('aria-describedby', referencias.join(' '));
  else control.removeAttribute('aria-describedby');
}

function errorEnControl(control, mensaje) {
  if (!control) return;
  control.setAttribute('aria-invalid', 'true');
  const idError = control.id + '-error';
  const error = document.getElementById(idError);
  if (error) { error.textContent = mensaje; error.hidden = false; }
  const referencias = new Set((control.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  referencias.add(idError);
  control.setAttribute('aria-describedby', [...referencias].join(' '));
}

function validarFormulario(formulario) {
  const controles = Array.from(formulario.querySelectorAll('input, select, textarea'));
  let primerError = null;

  controles.forEach((control) => {
    limpiarErrorControl(control);
    if (control.disabled || ['hidden', 'submit', 'button'].includes(control.type)) return;
    const mensaje = mensajeValidacion(control);
    if (!mensaje) return;
    errorEnControl(control, mensaje);
    primerError ??= control;
  });

  if (!primerError) return true;
  enfocar(primerError, false);
  anunciar('Hay errores en el formulario. Revisa el campo seleccionado.');
  return false;
}

function errorFormulario(formulario, campo, mensaje) {
  if (!formulario?.elements) { mostrarMensaje(mensaje); return; }
  const control = formulario.elements.namedItem(campo);
  errorEnControl(control, mensaje);
  enfocar(control, false);
  anunciar(mensaje);
}

function prepararAccesibilidad() {
  actualizarPanelFiltros();
  prepararFormularios();
  const titulo = $('#app h1');
  if (titulo) titulo.setAttribute('tabindex', '-1');
  document.querySelectorAll('[data-action="favorite"]').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(favorites.includes(Number(boton.dataset.id))));
  });
  const pestanas = document.querySelectorAll('[data-action="auth-tab"]');
  pestanas.forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.dataset.value === authTab));
  });
}

function actualizarPasoCheckout(evento) {
  const control = evento.target;
  if (!control.closest?.('#checkout-form')) return;

  let actual = 'informacion';
  if (['province', 'city', 'address', 'reference', 'delivery'].includes(control.name)) actual = 'entrega';
  if (control.name === 'payment' || control.name === 'terms') actual = 'pago';

  document.querySelectorAll('[data-checkout-step]').forEach((paso) => {
    const seleccionado = paso.dataset.checkoutStep === actual;
    paso.classList.toggle('active', seleccionado);
    if (seleccionado) paso.setAttribute('aria-current', 'step');
    else paso.removeAttribute('aria-current');
  });
}

document.addEventListener('focusin', actualizarPasoCheckout);
