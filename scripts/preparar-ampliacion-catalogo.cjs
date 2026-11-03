const fs = require('node:fs');
const productos = require('../database/ampliacion-catalogo.json');
const texto = (valor) => "'" + String(valor).replaceAll("'", "''") + "'";
const fotos = {
  DUL: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85',
  TRA: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85',
  REG: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85',
};
const codigo = (p) => 'P' + String(p.id).padStart(7, '0');
const variantes = (p) => 'V' + String(p.id).padStart(5, '0') + '01';
const filas = productos.map((p) => {
  const descripcion = `Descripción: ${p.descripcion}\nCaracterísticas: ${p.contenido}. Producto de demostración; precio y existencias ficticios. Proveedor y procedencia pendientes de confirmar. Imagen referencial de categoría, no fotografía del producto.\nConservación: Las condiciones de almacenamiento, caducidad e ingredientes deben confirmarse con el proveedor antes de una venta real.`;
  return `(${[codigo(p), p.categoria, p.nombre, descripcion, fotos[p.categoria]].map(texto).join(', ')}, 0, 'A')`;
});
const sql = `begin;
insert into public.producto (prd_codigo__, cat_codigo__, prd_nombre__, prd_descripcion__, prd_imagen_url__, prd_iva_porcentaje__, prd_estado__)
values ${filas.join(',\n')}
on conflict (prd_codigo__) do nothing;

insert into public.presentacion (prd_codigo__, pre_codigo__, unm_codigo__, pre_nombre__, pre_cantidad__, pre_molienda__, pre_precio__, pre_stock__, pre_estado__)
values ${productos.map((p) => `(${texto(codigo(p))}, ${texto(variantes(p))}, 'UND', ${texto(p.contenido)}, 1, 'NO_APLICA', ${p.precio}, 10, 'A')`).join(',\n')}
on conflict (pre_codigo__) do nothing;
commit;
`;
fs.writeFileSync('database/ampliacion-catalogo.sql', sql);
