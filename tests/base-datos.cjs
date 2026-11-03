const { PGlite } = require('@electric-sql/pglite');
const fs = require('node:fs');
const assert = require('node:assert/strict');

async function probar() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated;
    create schema auth;
    create table auth.users(id uuid primary key, email text);
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;`);
  await db.exec(fs.readFileSync('tests/esquema-base.sql', 'utf8'));
  await db.exec(`alter table public.usuario add column usr_auth_id uuid;
    alter table public.usuario alter column usr_password_hash__ drop not null;`);
  await db.exec(fs.readFileSync('database/catalogo-demostracion.sql', 'utf8'));
  await db.exec(fs.readFileSync('database/002-integracion-tienda.sql', 'utf8'));
  await db.exec(`insert into auth.users values ('00000000-0000-0000-0000-000000000001','uno@example.test'),('00000000-0000-0000-0000-000000000002','dos@example.test');
    insert into public.usuario(usr_codigo__,usr_nombre__,usr_correo__,usr_telefono__,usr_fecha_registro__,usr_estado__,usr_auth_id)
    values ('U1','Uno','uno@example.test','0999999999',current_date,'A','00000000-0000-0000-0000-000000000001'),
    ('U2','Dos','dos@example.test','0999999998',current_date,'A','00000000-0000-0000-0000-000000000002');
    grant usage on schema public,auth to authenticated;
    set role authenticated;
    select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);`);
  const operar = (accion, datos) => db.query('select public.tienda_operacion($1,$2::jsonb) as resultado', [accion, JSON.stringify(datos)]);
  const cuenta = async () => (await db.query('select public.tienda_cuenta() as datos')).rows[0].datos;
  await operar('favorito', { producto: 'P0000001', guardar: true });
  assert.deepEqual((await cuenta()).favoritos, ['P0000001']);
  await assert.rejects(operar('carrito', { presentacion: 'V0000101', cantidad: 1 }), /existencias/);
  await db.exec("reset role; update public.presentacion set pre_stock__=3 where pre_codigo__='V0000101'; set role authenticated;");
  await operar('carrito', { presentacion: 'V0000101', cantidad: 2, precio: 0.01 });
  await assert.rejects(operar('carrito', { presentacion: 'V0000101', cantidad: -1 }));
  const pedido = { solicitud: '10000000-0000-0000-0000-000000000001', nombre: 'Uno', telefono: '0999999999', provincia: 'Loja', ciudad: 'Loja', direccion: 'Calle de prueba', referencia: '', metodo: 'TRANSF', total: 0.01 };
  const creado = (await operar('pedido', pedido)).rows[0].resultado;
  assert.equal((await cuenta()).pedidos[0].total, 20.5);
  assert.equal((await cuenta()).pedidos[0].pagos[0].estado, 'PENDIENTE');
  assert.equal((await cuenta()).carrito.length, 0);
  assert.deepEqual((await operar('pedido', pedido)).rows[0].resultado, creado);
  assert.equal((await cuenta()).pedidos.length, 1);
  await db.exec("select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false)");
  assert.equal((await cuenta()).pedidos.length, 0);
  assert.equal((await cuenta()).favoritos.length, 0);
  await assert.rejects(operar('carrito', { presentacion: 'V0000101', cantidad: 2 }), /existencias/);
  await assert.rejects(db.query("update public.pago set pag_estado__='PAGADO'"), /permission/);
  await db.exec("reset role; set role anon;");
  await assert.rejects(cuenta(), /permission/);
  await db.close();
  console.log('PostgreSQL: aislamiento de cuentas, precios del servidor, stock, pagos pendientes e idempotencia correctos.');
}
probar().catch((error) => { console.error(error.message); process.exit(1); });
