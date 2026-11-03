# Café Mercadillo

Tienda de demostración con HTML, CSS, JavaScript y Supabase. Publicación: https://cafe-mercadillo.vercel.app.

## Desarrollo

Ejecutar npm ci, npm test y npm start con Node.js compatible con las dependencias. El servidor local sirve dist en el puerto 3000. npm run build copia los recursos públicos y empaqueta el cliente de Supabase; Vercel publica únicamente dist.

## Integración

js/conexion.js consulta PRODUCTO, CATEGORIA, PRESENTACION y METODO_PAGO. Los precios y existencias proceden de PRESENTACION. Supabase Auth gestiona contraseñas, registro, sesión y recuperación; USUARIO se vincula mediante usr_auth_id.

tienda_cuenta devuelve exclusivamente perfil, favoritos, direcciones, carrito, pedidos, pagos y seguimiento del usuario autenticado. tienda_operacion valida y guarda cambios. tienda_opiniones devuelve calificación, comentario y fecha públicos. Las funciones comprueban identidad y propiedad en el servidor; las tablas privadas no permiten escrituras directas desde el navegador.

El checkout exige cuenta y calcula precios y existencias en PostgreSQL. Pedido, detalle, orden de cobro, pago pendiente y descuento de stock se registran en una transacción. Una clave de solicitud evita duplicados al reintentar. El pedido conserva nombres y precios aunque cambie el catálogo.

La configuración de js/conexion.js es pública y no contiene claves administrativas. .env* y .vercel no se publican ni versionan. Las antiguas cuentas locales no se migran: el acceso utiliza Supabase Auth.

## Base de datos

Las migraciones database/002-integracion-tienda.sql y database/003-restringir-trigger.sql ya se aplicaron al proyecto existente de 23 tablas. Dependen del esquema original y de la vinculación previa con Auth.

En Supabase, Authentication → URL Configuration debe permitir https://cafe-mercadillo.vercel.app/ para confirmación y recuperación. Comprobar entrega de correos antes del uso público.

## Alcance pendiente

- 143 presentaciones tienen stock sin definir y una tiene cero. Registrar existencias reales para habilitar compras.
- No hay pasarela de cobro ni verificación automática de transferencias.
- No hay panel administrativo, de repartidores ni carga de evidencias. El seguimiento lee los registros existentes.
- Los cupones no están habilitados. DESCUENTO se conserva para una implementación posterior.
- Provincia y ciudad se eligen de una lista local; DIRECCION guarda la selección.
- Contacto y perfil sensorial siguen siendo demostrativos. Verificar precios, impuestos, fotografías y tarifas antes de vender.

## Verificación

npm test comprueba las funciones en PostgreSQL aislado mediante PGlite: aislamiento de cuentas, permisos, stock, precio del servidor, pago pendiente e idempotencia. Las pruebas DOM con JSDOM comprueban catálogo, variantes, acceso requerido y favoritos pendientes con respuestas simuladas. No sustituyen una compra completa con cuenta real ni una auditoría integral de accesibilidad.

El asesor de Supabase señala funciones SECURITY DEFINER intencionales y tablas privadas sin políticas directas: el acceso está encapsulado en funciones que validan auth.uid(). La protección de contraseñas filtradas está deshabilitada en Auth; revisar https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection.
