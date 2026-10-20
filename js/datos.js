'use strict';

const foto = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

const imgs = {
  coffee: foto('photo-1447933601403-0c6688de566e'),
  cup: foto('photo-1495474472287-4d71bcdd2085'),
  beans: foto('photo-1559056199-641a0ac8b55e'),
  land: foto('photo-1441974231531-c6227db76b6e'),
  sweets: foto('photo-1484723091739-30a097e8f929'),
  gift: foto('photo-1513885535751-8b9238bd345a'),
  food: foto('photo-1544787219-7f47ccb76574'),
};

const legacyProducts = [
  {
    id: 1,
    name: 'Café Premium Loja',
    category: 'Café',
    price: 8.5,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: '250 g',
    presentation: 'Molido',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 2,
    name: 'Café de altura Alamor',
    category: 'Café',
    price: 10.5,
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: '250 g',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 3,
    name: 'Café de origen Mercadillo',
    category: 'Café',
    price: 9,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: '250 g',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 4,
    name: 'Blend Mercadillo',
    category: 'Café',
    price: 12,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: '250 g',
    presentation: 'En grano',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 5,
    name: 'Café especial Mercadillo',
    category: 'Café',
    price: 11,
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: '250 g',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 6,
    name: 'Café intenso Alamor',
    category: 'Café',
    price: 7.5,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: '250 g',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 7,
    name: 'Café suave Mercadillo',
    category: 'Café',
    price: 8,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: '250 g',
    presentation: 'Molido',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 8,
    name: 'Café orgánico Loja',
    category: 'Café',
    price: 13,
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: '250 g',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 9,
    name: 'Café reserva de altura',
    category: 'Café',
    price: 14,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: '250 g',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 10,
    name: 'Pack café de origen',
    category: 'Café',
    price: 22,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: '250 g',
    presentation: 'En grano',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 11,
    name: 'Café descafeinado',
    category: 'Café',
    price: 10,
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: '250 g',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 12,
    name: 'Café tostado artesanal',
    category: 'Café',
    price: 9.5,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: '250 g',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 13,
    name: 'Bocadillos lojanos',
    category: 'Dulces',
    price: 4.5,
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: 'Unidad',
    presentation: 'Molido',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 14,
    name: 'Dulce de guayaba',
    category: 'Dulces',
    price: 5,
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: 'Unidad',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 15,
    name: 'Roscones tradicionales',
    category: 'Dulces',
    price: 3.5,
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: 'Unidad',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 16,
    name: 'Dulce de leche artesanal',
    category: 'Dulces',
    price: 6,
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: 'Unidad',
    presentation: 'En grano',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 17,
    name: 'Horchata lojana',
    category: 'Tradicionales',
    price: 4,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: 'Unidad',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 18,
    name: 'Miel de abeja',
    category: 'Tradicionales',
    price: 7,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: 'Unidad',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 19,
    name: 'Panela artesanal',
    category: 'Tradicionales',
    price: 3,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: 'Unidad',
    presentation: 'Molido',
    roast: 'Oscuro',
    stock: false,
  },
  {
    id: 20,
    name: 'Infusión de hierbas',
    category: 'Tradicionales',
    price: 4.5,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: 'Unidad',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 21,
    name: 'Caja sabores de Loja',
    category: 'Regalos',
    price: 25,
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: 'Unidad',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 22,
    name: 'Regalo para amantes del café',
    category: 'Regalos',
    price: 29,
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: 'Unidad',
    presentation: 'En grano',
    roast: 'Oscuro',
    stock: true,
  },
  {
    id: 23,
    name: 'Pack tradición lojana',
    category: 'Regalos',
    price: 24,
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85',
    origin: 'Mercadillo',
    weight: 'Unidad',
    presentation: 'Molido',
    roast: 'Medio',
    stock: true,
  },
  {
    id: 24,
    name: 'Kit de café y taza',
    category: 'Regalos',
    price: 18,
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85',
    origin: 'Alamor',
    weight: 'Unidad',
    presentation: 'En grano',
    roast: 'Medio',
    stock: true,
  },
];

const products = legacyProducts.filter((p) => p.id !== 4);

const buscarProducto = (id) => legacyProducts.find((p) => p.id === Number(id));

const icons = {
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  heart: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1s-1 7 8 14c9-7 11-11 8-14Z"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  bag: '<path d="M5 7h14l2 14H3L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
  menu: '<path d="M3 5h18M3 12h18M3 19h18"/>',
};

const icon = (n) => html`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${icons[n]}
  </svg>
`;

const logo = html`
  <a class="logo" href="#inicio" aria-label="Café Mercadillo, inicio">
    <svg viewBox="0 0 45 45" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M8 15h25v12a11 11 0 0 1-22 0V15m22 3h3a6 6 0 0 1 0 12h-4M8 40h27M17 3v7m9-7v7" />
    </svg>
    <span>
      <b>Café Mercadillo</b>
      <small>DE LOJA, CON ORGULLO</small>
    </span>
  </a>
`;

const provinceCities = {
  Azuay: ['Cuenca', 'Gualaceo', 'Paute', 'Sígsig'],
  Bolívar: ['Guaranda', 'San Miguel', 'Chimbo'],
  Cañar: ['Azogues', 'Cañar', 'La Troncal'],
  Carchi: ['Tulcán', 'San Gabriel', 'El Ángel'],
  Chimborazo: ['Riobamba', 'Guano', 'Alausí', 'Chambo'],
  Cotopaxi: ['Latacunga', 'Salcedo', 'Pujilí', 'La Maná'],
  'El Oro': ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas', 'Zaruma', 'Piñas'],
  Esmeraldas: ['Esmeraldas', 'Atacames', 'Quinindé', 'San Lorenzo'],
  Galápagos: ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'],
  Guayas: ['Guayaquil', 'Durán', 'Daule', 'Samborondón', 'Milagro', 'Playas'],
  Imbabura: ['Ibarra', 'Otavalo', 'Cotacachi', 'Atuntaqui'],
  Loja: [
    'Loja',
    'Alamor',
    'Mercadillo',
    'Catamayo',
    'Cariamanga',
    'Macará',
    'Celica',
    'Saraguro',
    'Catacocha',
  ],
  'Los Ríos': ['Babahoyo', 'Quevedo', 'Ventanas', 'Vinces'],
  Manabí: ['Portoviejo', 'Manta', 'Chone', 'Jipijapa', 'Bahía de Caráquez', 'Montecristi'],
  'Morona Santiago': ['Macas', 'Sucúa', 'Gualaquiza'],
  Napo: ['Tena', 'Archidona', 'El Chaco'],
  Orellana: ['Puerto Francisco de Orellana', 'La Joya de los Sachas'],
  Pastaza: ['Puyo', 'Mera', 'Santa Clara'],
  Pichincha: ['Quito', 'Sangolquí', 'Cayambe', 'Machachi'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  Sucumbíos: ['Nueva Loja', 'Shushufindi'],
  Tungurahua: ['Ambato', 'Baños de Agua Santa', 'Pelileo', 'Píllaro'],
  'Zamora Chinchipe': ['Zamora', 'Yantzaza', 'Zumba'],
};

const faqs = [
  [
    'Envíos',
    '¿Cuánto demora el envío?',
    'En esta demostración se muestra un plazo estimado de 3 a 5 días hábiles. Los plazos reales deben confirmarse antes de publicar la tienda.',
  ],
  [
    'Pagos',
    '¿Qué métodos de pago aceptan?',
    'Puedes simular un pedido con transferencia bancaria o pago contra entrega. No se procesa ningún cobro.',
  ],
  [
    'Compras',
    '¿Cómo puedo rastrear mi pedido?',
    'Sin cuenta, usa Consultar un pedido con el número y correo de la compra. Con cuenta, también puedes usar Mis pedidos. En esta demostración la consulta funciona en el navegador donde compraste.',
  ],
  [
    'Devoluciones',
    '¿Cómo realizo una devolución?',
    'Completa el formulario de contacto con el número de pedido y tu consulta. El formulario es de demostración y no envía mensajes.',
  ],
  [
    'Cuenta',
    '¿Cómo guardo mis favoritos?',
    'Inicia sesión y pulsa el corazón de un producto. Tus favoritos se guardan por cuenta en este navegador.',
  ],
  [
    'Compras',
    '¿Cómo aplico un descuento?',
    'Usa el código LOJA10 en el carrito para probar un descuento del 10%.',
  ],
  [
    'Cuenta',
    'Términos y privacidad de la demostración',
    'La tienda no realiza ventas reales. Carrito, perfil, direcciones y pedidos se guardan únicamente en este navegador. No introduzcas datos sensibles ni contraseñas reales.',
  ],
];
