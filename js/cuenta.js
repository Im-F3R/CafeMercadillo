'use strict';

function mostrarAcceso() {
  return plantilla('acceso', {
    claseAcceso: authTab === 'login' ? 'active' : '',
    claseRegistro: authTab === 'register' ? 'active' : '',
    titulo: authTab === 'login' ? 'Bienvenido de nuevo' : 'Un gusto conocerte',
    datosRegistro:
      authTab === 'register'
        ? crearCampo('Nombre', 'name') + crearCampo('Apellido', 'surname')
        : '',
    correo: crearCampo('Correo electrónico', 'email', 'email'),
    contrasena: crearCampo('Contraseña', 'password', 'password'),
    confirmacion:
      authTab === 'register'
        ? crearCampo('Confirmar contraseña', 'confirm', 'password') +
          '<label><input type="checkbox" name="terms" required>Acepto los términos de esta demostración.</label>'
        : '',
    textoBoton: authTab === 'login' ? 'Iniciar sesión' : 'Crear cuenta',
    recuperacion:
      authTab === 'login'
        ? '<button class="chip recovery-button" data-action="recover">¿Olvidaste tu contraseña?</button>'
        : '',
  });
}

function mostrarCuenta(address = false) {
  if (!profile)
    return plantilla('cuenta-vacio', { contenido1: crearBoton('Iniciar sesión', 'login') });
  return plantilla('cuenta', {
    ruta: crearRuta('Mi cuenta'),
    nombre: escaparTexto(profile.name),
    menu: crearMenuCuenta(address ? 'direcciones' : 'cuenta'),
    contenido: address
      ? html`
          <h2>Mis direcciones</h2>
          ${
            addresses
              .map(
                (a, i) => html`
                  <article class="panel order">
                    <h3>${escaparTexto(a.address)}</h3>
                    <p>${escaparTexto(a.city)} · ${escaparTexto(a.reference)}</p>
                    <div class="buttons">
                      <button class="btn secondary" data-action="edit-address" data-index="${i}" aria-label="Editar dirección ${escaparTexto(a.address)}, ${escaparTexto(a.city)}">
                        Editar
                      </button>
                      <button class="btn secondary" data-action="delete-address" data-index="${i}" aria-label="Eliminar dirección ${escaparTexto(a.address)}, ${escaparTexto(a.city)}">
                        Eliminar
                      </button>
                    </div>
                  </article>
                `,
              )
              .join('') || '<p>Aún no tienes direcciones guardadas.</p>'
          }
          <button class="btn" data-action="new-address">Añadir nueva dirección</button>
          <form class="panel hidden spaced-panel" id="address-form" data-form="address">
            <input type="hidden" name="index" value="-1" />
            <div class="fields">
              ${crearCampo('Dirección', 'address')}${crearCampo('Ciudad', 'city')}${crearCampo('Referencia', 'reference', 'text', '', false)}
            </div>
            <button class="btn full">Guardar dirección</button>
          </form>
        `
      : html`
          <div class="panel">
            <h2>Mi perfil</h2>
            <form data-form="profile">
              <div class="fields">
                ${crearCampo('Nombre', 'name', 'text', profile.name)}${crearCampo('Apellido', 'surname', 'text', profile.surname || '')}${crearCampo('Correo', 'email', 'email', profile.email)}${crearCampo('Teléfono', 'phone', 'tel', profile.phone || '', false)}
              </div>
              <button class="btn save-profile-button">Guardar información</button>
            </form>
          </div>
        `,
  });
}

async function resumirContrasena(password) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}
