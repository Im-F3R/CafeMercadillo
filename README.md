# Café Mercadillo

Web de demostración en HTML, CSS y JavaScript, sin dependencias de compilación.

Ejecuta `node server.cjs` y visita http://localhost:3000. También puedes usar Live Server o la publicación en GitHub Pages. Las vistas HTML se cargan desde `plantillas/`, por lo que la web debe abrirse desde un servidor HTTP y no haciendo doble clic en `index.html`.

Incluye las 14 vistas solicitadas y la sección de direcciones: inicio, catálogo, categoría, búsqueda, producto, carrito, checkout, confirmación, acceso/registro, cuenta, pedidos, favoritos, nosotros y ayuda.

Funciones: búsqueda, filtros, ordenamiento y paginación de 23 productos de Mercadillo y Alamor; galería, presentación, pesos de 250 g / 450 g / 900 g y precio por cantidad; carrito y variantes; descuento LOJA10; favoritos por cuenta; perfil y direcciones; historial de pedidos por cuenta y consulta de invitados con número y correo; preguntas frecuentes y formularios de demostración.

Carrito, favoritos, cuentas de prueba, perfil, direcciones y pedidos se guardan localmente en este navegador. El registro y acceso exigen al menos 6 caracteres; se compara un resumen SHA-256 local, sin guardar la contraseña en texto. Esta simulación no constituye autenticación segura para producción. No hay pagos ni envío de correos. Los pedidos de invitados no se incorporan automáticamente a una cuenta y el seguimiento solo funciona en el navegador donde se compró.

Tarifas provisionales: el precio base corresponde a 250 g molido; 450 g multiplica por 1,8 y 900 g por 3,6; en grano tiene un 5% adicional. La molienda no agrega costo. Se redondea el precio por unidad a centavos antes de multiplicar por cantidad. Los productos, reseñas, precios, fotografías y plazos son ilustrativos y deben verificarse antes de vender. Las fotografías y fuentes tipográficas requieren conexión a Internet.

El checkout valida correo con dominio, teléfono de 10 dígitos y selección obligatoria de provincia y ciudad. Incluye 24 provincias y ciudades principales; no es un registro geográfico exhaustivo.

Comprobaciones: `node verify.cjs` y `node --check app.js`.

- index.html: entrada principal.
- styles.css: sistema visual y diseño adaptable.
- app.js: inicio de la aplicación, carga de plantillas y navegación.
- plantillas/: HTML separado y con sangría para cada vista y componente.
- js/datos.js: registros de productos, preguntas y ubicaciones.
- js/estado.js: datos guardados y estado actual.
- js/utilidades.js: formato de precios, campos y carga del contenido de plantillas.
- js/componentes.js: encabezado, pie, tarjetas y componentes compartidos.
- js/tienda.js: catálogo, categorías y detalle de productos.
- js/compras.js: carrito, resumen y vistas de pedidos.
- js/cuenta.js: vistas de registro, acceso y perfil.
- js/ayuda.js: preguntas frecuentes y vista de ayuda.
- js/acciones.js: funciones de cada acción y eventos de formularios y botones.
- favicon.svg: icono de marca.
- server.cjs: servidor local opcional, sin paquetes externos.

No se requieren bibliotecas externas de JavaScript ni compilación. Los nombres de las funciones describen su acción y el código no contiene comentarios. Los datos locales existentes conservan sus claves para mantener carritos, cuentas y pedidos de pruebas anteriores.

La portada usa tamaños fluidos para mantener la legibilidad en distintas pantallas. Las tarjetas indican a qué presentación corresponde el precio; el detalle muestra la presentación elegida y el total por cantidad. Volver a pulsar Ayuda restaura todas las preguntas y limpia la búsqueda. Si se pulsa un favorito sin sesión, se completa el guardado después de un acceso correcto; abandonar el acceso cancela esa intención.

El detalle utiliza pestañas horizontales para Descripción, Origen, Características, Preparación recomendada y Conservación, con un único panel de contenido. Admiten clic y teclado (flechas, Inicio y Fin). En móvil, la fila permite desplazamiento horizontal. El perfil del café muestra valores ilustrativos de 1 a 10 con diez segmentos por atributo y puntuación numérica. El guardado pendiente de favoritos se verifica tanto al iniciar sesión como al crear una cuenta.
