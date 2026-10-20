'use strict';

function leerDatos(k, f) {
  try {
    return JSON.parse(localStorage.getItem('mercadillo-' + k)) ?? f;
  } catch {
    return f;
  }
}

let cart = leerDatos('cart', []),
  favorites = leerDatos('favorites', []),
  profile = leerDatos('profile', null),
  orders = leerDatos('orders', []),
  addresses = leerDatos('addresses', []),
  lastOrder = leerDatos('lastOrder', null),
  coupon = leerDatos('coupon', false),
  authTab = 'login',
  orderFilter = 'Todos',
  helpCategory = '',
  page = 1,
  sort = 'recommended';

let accounts = leerDatos('accounts', []),
  favoriteAccounts = leerDatos('favoriteAccounts', {}),
  returnTo = 'cuenta';

let favoritoPendiente = null;

if (profile && !accounts.some((a) => a.email === profile.email.toLowerCase())) profile = null;

favorites = profile ? favoriteAccounts[profile.email.toLowerCase()] || [] : [];

cart = cart.filter((c) => products.some((p) => p.id === c.id));

const crearFiltrosIniciales = () => ({
  category: '',
  price: 50,
  presentation: '',
  origin: '',
  stock: false,
  roast: '',
  weight: '',
});

let filters = crearFiltrosIniciales();

function guardarDatos() {
  try {
    for (const [k, v] of Object.entries({
      cart,
      favorites,
      profile,
      orders,
      addresses,
      lastOrder,
      coupon,
      accounts,
      favoriteAccounts,
    }))
      localStorage.setItem('mercadillo-' + k, JSON.stringify(v));
  } catch {
    mostrarMensaje('Tu navegador no permite guardar los cambios.');
  }
}
