const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const raiz = path.resolve(__dirname, '..');
const contexto = vm.createContext({});
const datos = fs.readFileSync(path.join(raiz, 'js/datos.js'), 'utf8');
const tienda = fs.readFileSync(path.join(raiz, 'js/tienda.js'), 'utf8');
vm.runInContext(datos.slice(0, datos.indexOf('const icons =')), contexto);
vm.runInContext(tienda, contexto);
const productos = vm.runInContext('products', contexto);
const precioVariante = vm.runInContext('calcularPrecioVariante', contexto);
const informacion = vm.runInContext('informacionProducto', contexto);

const categorias = [
  ['CAF', 'Café', 'Café de Mercadillo y Alamor.', 'A'],
  ['DUL', 'Dulces', 'Dulces del catálogo de Café Mercadillo.', 'A'],
  ['TRA', 'Tradicionales', 'Productos tradicionales del catálogo de Café Mercadillo.', 'A'],
  ['REG', 'Regalos', 'Cajas, packs y kits para regalar.', 'A'],
];
const unidades = [
  ['G', 'Gramo', 'g', 'PESO'],
  ['UND', 'Unidad', 'ud', 'UNIDAD'],
];
const codigoCategoria = new Map(categorias.map(([codigo, nombre]) => [nombre, codigo]));
const filasProductos = [];
const presentaciones = [];

for (const producto of productos) {
  const codigo = 'P' + String(producto.id).padStart(7, '0');
  const descripcion = informacion(producto)
    .map((apartado) => `${apartado.titulo}: ${apartado.texto}`)
    .join('\n');

  filasProductos.push([
    codigo,
    codigoCategoria.get(producto.category),
    producto.name,
    descripcion,
    producto.image,
    0,
    'A',
  ]);

  const variantes = producto.category === 'Café'
    ? [250, 450, 900].flatMap((peso) => [
        [peso, 'G', 'Bolsa', 'MOLIDO_MEDIA', 'Molido'],
        [peso, 'G', 'Bolsa', 'MOLIDO_FINA', 'Molido'],
        [peso, 'G', 'Bolsa', 'MOLIDO_GRUESA', 'Molido'],
        [peso, 'G', 'Bolsa', 'EN_GRANO', 'En grano'],
      ])
    : [[1, 'UND', 'Unidad', 'NO_APLICA', 'Unidad']];

  variantes.forEach(([cantidad, unidad, nombre, molienda, seleccion], indice) => {
    const peso = producto.category === 'Café' ? `${cantidad} g` : producto.weight;
    presentaciones.push([
      codigo,
      'V' + String(producto.id * 100 + indice + 1).padStart(7, '0'),
      unidad,
      nombre,
      cantidad,
      molienda,
      precioVariante(producto, seleccion, peso),
      producto.stock ? null : 0,
      'A',
    ]);
  });
}

function literal(valor) {
  if (valor === null) return 'NULL';
  if (typeof valor === 'number') {
    assert(Number.isFinite(valor));
    return String(valor);
  }
  assert.equal(typeof valor, 'string');
  return "'" + valor.replaceAll("'", "''") + "'";
}

function insertar(tabla, columnas, filas, clave) {
  return `insert into public.${tabla} (\n   ${columnas.join(',\n   ')}\n)\nvalues\n${filas.map((fila) => '   (' + fila.map(literal).join(', ') + ')').join(',\n')}\non conflict (${clave}) do nothing;`;
}

assert.equal(productos.length, 23);
assert.equal(presentaciones.length, 144);
assert(!productos.some((producto) => producto.id === 4));
assert.equal(new Set(presentaciones.map((fila) => fila[1])).size, 144);
for (const fila of filasProductos) {
  assert.equal(fila[0].length, 8);
  assert(codigoCategoria.has(productos.find((p) => 'P' + String(p.id).padStart(7, '0') === fila[0]).category));
  assert(fila[2].length <= 100);
  assert(fila[3].length <= 1000);
  assert(fila[4].length <= 500);
}
for (const fila of presentaciones) {
  assert.equal(fila[1].length, 8);
  assert(fila[5].length <= 20);
  assert(fila[6] > 0);
  assert(filasProductos.some((producto) => producto[0] === fila[0]));
  assert(unidades.some((unidad) => unidad[0] === fila[2]));
}
assert.equal(precioVariante(productos[0], 'Molido', '450 g'), 15.3);
assert.equal(precioVariante(productos[0], 'En grano', '900 g'), 32.13);
assert.equal(presentaciones.filter((fila) => fila[7] === 0).length, 1);

const bloques = [
  'begin;',
  insertar('unidad_medida', ['unm_codigo__', 'unm_nombre__', 'unm_abreviatura__', 'unm_tipo'], unidades, 'unm_codigo__'),
  insertar('categoria', ['cat_codigo__', 'cat_nombre__', 'cat_descripcion__', 'cat_estado__'], categorias, 'cat_codigo__'),
  insertar('producto', ['prd_codigo__', 'cat_codigo__', 'prd_nombre__', 'prd_descripcion__', 'prd_imagen_url__', 'prd_iva_porcentaje__', 'prd_estado__'], filasProductos, 'prd_codigo__'),
  insertar('presentacion', ['prd_codigo__', 'pre_codigo__', 'unm_codigo__', 'pre_nombre__', 'pre_cantidad__', 'pre_molienda__', 'pre_precio__', 'pre_stock__', 'pre_estado__'], presentaciones, 'pre_codigo__'),
  'commit;',
];

fs.writeFileSync(path.join(__dirname, 'catalogo-demostracion.sql'), bloques.join('\n\n') + '\n', 'utf8');
console.log(JSON.stringify({ unidades: unidades.length, categorias: categorias.length, productos: filasProductos.length, presentaciones: presentaciones.length, validaciones: 'correctas' }));
