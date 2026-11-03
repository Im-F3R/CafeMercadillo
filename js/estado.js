'use strict';

let cart = [], favorites = [], profile = null, orders = [], addresses = [], lastOrder = null,
  coupon = false, authTab = 'login', orderFilter = 'Todos', helpCategory = '', page = 1, sort = 'recommended';
let returnTo = sessionStorage.getItem('mercadillo-retorno') || 'cuenta';
let favoritoPendiente = null;
const crearFiltrosIniciales = () => ({
  category: '', price: 50, presentation: '', origin: '', stock: false, roast: '', weight: '',
});
let filters = crearFiltrosIniciales();
