# Revisión del informe TAW del 29 de octubre de 2026

El PDF analiza la portada publicada, no todos los estados de la tienda. Sus cuatro errores F89 corresponden exactamente a los enlaces Buscar, Favoritos, Mi cuenta y Carrito (líneas 65, 70, 77 y 85 del HTML reproducido en el informe).

## Correcciones

- Los cuatro enlaces incorporan texto HTML mediante `sr-only`, además de su etiqueta accesible. Los iconos siguen siendo decorativos. Se conserva el diseño y el destino de cada enlace.
- Las 12 advertencias sobre etiquetas de presentación corresponden a dos nombres de marca con `b`, dos lemas con `small` y ocho metadatos de producto con `small`. Se sustituyen por `span` con clases descriptivas y los mismos estilos. La plantilla compartida aplica la mejora a todo el catálogo.
- El título de inicio describe ahora el contenido: «Café de origen y productos lojanos | Café Mercadillo».
- No se modifican valores de color.

## Advertencias revisadas

Las diez imágenes con posible descripción larga son fotografías de portada, paisaje y productos. Sus alternativas identifican el contenido o el producto enlazado; el informe no muestra gráficos complejos que necesiten una descripción larga. Las cuatro imágenes de categoría tienen alternativa vacía porque el texto de su mismo enlace ya identifica la categoría: se conserva esa alternativa para evitar repetición.

Los 17 encabezados señalados son solicitudes de revisión manual, no 17 errores de jerarquía. Se conservan el h1 de portada, los h2 de secciones y pie y los h3 de productos; las pruebas comprueban la jerarquía.

Los signos de interrogación sobre contraste, foco, teclado, movimiento, idioma y comportamiento no acreditan fallos. Tampoco desaparecen necesariamente por cambiar código. La revisión previa de accesibilidad y sus límites están documentados en ACCESIBILIDAD.md. La conformidad completa requiere comprobar también tecnologías de asistencia y estados interactivos.

## Validación

`npm test` pasa con las correcciones: vistas, precios, compra, pedidos, validación de formularios, foco, anuncios, favoritos, ayuda y pestañas. La diferencia de código conserva los colores originales.

La eliminación de los cuatro errores en el servicio TAW debe confirmarse con un nuevo análisis de la versión publicada. Este documento no presenta una estimación como si fuera un resultado emitido por TAW.
