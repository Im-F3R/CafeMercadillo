'use strict';

function crearPreguntas(q, c) {
  return (
    faqs
      .filter(
        ([cat, t, a]) => (!c || cat === c) && `${t} ${a}`.toLowerCase().includes(q.toLowerCase()),
      )
      .map(
        ([cat, t, a]) => html`
          <details>
            <summary>${t}</summary>
            <p>${a}</p>
          </details>
        `,
      )
      .join('') || '<p>No encontramos preguntas. Prueba otra consulta.</p>'
  );
}

function mostrarAyuda(r) {
  helpCategory = r.params.get('tema') || helpCategory;
  return plantilla('ayuda', {
    ruta: crearRuta('Ayuda'),
    categorias: ['Compras', 'Envíos', 'Pagos', 'Cuenta', 'Devoluciones']
      .map(
        (c) => html`
          <button data-action="help-category" data-value="${c}">${c}</button>
        `,
      )
      .join(''),
    preguntas: crearPreguntas('', helpCategory),
    nombre: crearCampo('Nombre', 'name'),
    correo: crearCampo('Correo', 'email', 'email'),
    asunto: crearCampo('Asunto', 'subject'),
  });
}
