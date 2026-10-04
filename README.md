# Café Mercadillo

Web de demostración en HTML, CSS y JavaScript, sin dependencias de compilación.

Abre `index.html` en un navegador. Con Node.js puedes ejecutar `node server.cjs` y visitar http://localhost:3000.

Incluye las 14 vistas solicitadas y la sección de direcciones: inicio, catálogo, categoría, búsqueda, producto, carrito, checkout, confirmación, acceso/registro, cuenta, pedidos, favoritos, nosotros y ayuda.

Funciones: búsqueda, filtros, ordenamiento y paginación de 23 productos de Mercadillo y Alamor; galería, presentación, pesos de 250 g / 450 g / 900 g y precio por cantidad; carrito y variantes; descuento LOJA10; favoritos por cuenta; perfil y direcciones; historial de pedidos por cuenta y consulta de invitados con número y correo; preguntas frecuentes y formularios de demostración.

Carrito, favoritos, cuentas de prueba, perfil, direcciones y pedidos se guardan localmente en este navegador. El registro y acceso exigen al menos 6 caracteres; se compara un resumen SHA-256 local, sin guardar la contraseña en texto. Esta simulación no constituye autenticación segura para producción. No hay pagos ni envío de correos. Los pedidos de invitados no se incorporan automáticamente a una cuenta y el seguimiento solo funciona en el navegador donde se compró.

Tarifas provisionales: el precio base corresponde a 250 g molido; 450 g multiplica por 1,8 y 900 g por 3,6; en grano tiene un 5% adicional. La molienda no agrega costo. Se redondea el precio por unidad a centavos antes de multiplicar por cantidad. Los productos, reseñas, precios, fotografías y plazos son ilustrativos y deben verificarse antes de vender. Las fotografías y fuentes tipográficas requieren conexión a Internet.

El checkout valida correo con dominio, teléfono de 10 dígitos y selección obligatoria de provincia y ciudad. Incluye 24 provincias y ciudades principales; no es un registro geográfico exhaustivo.

Comprobaciones: `node verify.cjs` y `node --check app.js`.

- index.html: entrada principal.
- styles.css: sistema visual y diseño adaptable.
- app.js: vistas, catálogo y comportamiento.
- favicon.svg: icono de marca.
- server.cjs: servidor local opcional, sin paquetes externos.
