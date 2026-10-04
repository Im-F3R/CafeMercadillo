# Café Mercadillo

Web de demostración en HTML, CSS y JavaScript, sin dependencias de compilación.

Abre `index.html` en un navegador. Con Node.js puedes ejecutar `node server.cjs` y visitar http://localhost:3000.

Incluye las 14 vistas solicitadas y la sección de direcciones: inicio, catálogo, categoría, búsqueda, producto, carrito, checkout, confirmación, acceso/registro, cuenta, pedidos, favoritos, nosotros y ayuda.

Funciones: búsqueda, filtros, ordenamiento y paginación de 24 productos; galería, presentación y molienda; carrito y cantidades; descuento LOJA10; favoritos; perfil y direcciones; pedidos de prueba y detalle; preguntas frecuentes y formularios de demostración.

Carrito, favoritos, perfil, direcciones y pedidos se guardan localmente en este navegador. El acceso es simulado y no almacena contraseñas. No hay autenticación real, pagos ni envío de correos. Los productos, reseñas, precios, fotografías y plazos son ilustrativos. Deben sustituirse por información comercial verificada antes de vender. Las fotografías y fuentes tipográficas requieren conexión a Internet.

- index.html: entrada principal.
- styles.css: sistema visual y diseño adaptable.
- app.js: vistas, catálogo y comportamiento.
- favicon.svg: icono de marca.
- server.cjs: servidor local opcional, sin paquetes externos.
