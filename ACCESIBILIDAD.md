# Revisión de accesibilidad de Café Mercadillo

Fecha: 28 de octubre de 2026.

El informe adjunto identifica 43 hallazgos pendientes y cinco correcciones anteriores que deben conservarse. Se revisaron los hallazgos contra el código, se corrigieron los problemas reproducibles y se incorporaron pruebas de lógica y DOM. La compra continúa siendo una demostración local, sin cobros ni conexión logística.

## Colores y legibilidad

Se conservaron las variables de marca y todos los colores existentes. La comparación con la versión anterior confirmó que no se incorporó ni sustituyó ningún valor hexadecimal de la paleta.

El rótulo `#A56C35` mantiene aproximadamente 4,09:1 sobre `#FAF7F0`. En lugar de oscurecerlo, ahora se utiliza a 19 px y peso 700. Esto supera el umbral de texto grande en negrita de 14 pt, para el cual WCAG permite 3:1. Las estrellas conservan su color, se muestran a 24 px y se acompañan con una valoración textual independiente; los símbolos decorativos se ocultan al lector de pantalla. Los textos funcionales se ajustaron a un mínimo de 0,875 rem y el texto general a 1 rem.

Estas decisiones atienden el problema de legibilidad sin modificar los colores solicitados. No equivalen a una certificación de conformidad de toda la aplicación.

## Matriz de correcciones

| ID | Corrección aplicada |
| --- | --- |
| G01 | Menú compacto desde 75 rem, columnas adaptables, controles con espacio mínimo, paginación que pasa a otra fila y pruebas de reflujo. |
| G02 | Texto funcional mínimo de 0,875 rem, contenido general de 1 rem y unidades relativas. |
| G03 | Rótulos a 19 px y peso 700, conservando el tono original y aplicando el criterio de texto grande. |
| G04 | Estrellas grandes y decorativas, acompañadas de valoración textual. |
| G05 | El enlace Saltar al contenido apunta al `main` existente con `href="#app"`; el destino acepta foco. |
| G06 | Los cambios de ruta enfocan el `h1` de la vista, incluida Confirmación. |
| G07 | El renderizado interno captura y restituye el foco por identificador, nombre o contexto de la acción. Favoritos conserva las selecciones del producto sin volver a dibujar su ficha. |
| G08 | Región estable y breve de anuncios para resultados, cantidades, totales y otros cambios relevantes. |
| G09 | Secciones de resultados y carrito con `h2`, productos internos con `h3` y detalle de pedido con `h2`. |
| G10 | Un `h1` en acceso, cuenta sin sesión, confirmación vacía y las demás vistas y estados principales. |
| G11 | Los enlaces de detalle identifican el producto o número de pedido. |
| G12 | Los botones de carrito, compra y direcciones incluyen el elemento y, cuando corresponde, su variante. |
| G13 | Estados de selección, apertura y ubicación con `aria-pressed`, `aria-expanded`, `aria-controls` y `aria-current`. |
| G14 | Migas de pan con `nav`, lista ordenada y elemento actual identificado. |
| G15 | Imágenes decorativas de categorías con alternativa vacía para evitar nombres duplicados. |
| T01 | El panel de filtros y su botón comparten estado real de apertura y relación mediante `aria-controls`. |
| T02 | El número de productos y la página actual se anuncian al filtrar, ordenar o paginar. |
| T03 | La página seleccionada expone `aria-current="page"`. |
| T04 | Los botones de subcategoría comunican su selección mediante `aria-pressed`. |
| B01 | El símbolo sin resultados es decorativo y usa `aria-hidden`. |
| P01 | La ficha incluye la valoración textual de cinco estrellas como equivalente accesible. |
| P02 | El favorito de la ficha utiliza `aria-pressed` y conserva su estado al actualizarse. |
| P03 | Abrir una opinión enfoca su primer campo; cerrar o guardar devuelve el foco al botón de apertura. |
| C01 | Cambiar cantidad anuncia producto, cantidad y total actualizado. |
| C02 | Eliminar una línea dirige el foco a un control equivalente de la siguiente o anterior; si el carrito queda vacío, al título. |
| CH01 | Entrega y pago se agrupan en `fieldset` y `legend`; ambas opciones de pago pertenecen al mismo grupo. |
| CH02 | Las etapas usan lista ordenada y el paso actual se actualiza según la sección del formulario que recibe foco. |
| CH03 | Errores por control con `aria-invalid`, `aria-describedby`, mensaje visible y foco en el primer error; se conservan los datos. |
| CH04 | La confirmación recibe foco en su encabezado de éxito. |
| CO01 | El progreso es una lista ordenada con estado actual y etapas completadas o pendientes. |
| L01 | Los botones de acceso y registro comunican selección con `aria-pressed` y mantienen el foco al cambiar de modo. |
| L02 | Errores de longitud, confirmación, cuenta duplicada y credenciales se asocian a su campo. |
| L03 | Se declara propósito de nombre, apellido, correo, teléfono, dirección, provincia, ciudad y contraseña mediante `autocomplete`. |
| D01 | Nueva dirección enfoca el primer campo editable. |
| D02 | Editar dirección carga sus datos y enfoca el campo de dirección. |
| D03 | Editar y eliminar indican calle y ciudad en su nombre accesible. |
| PE01 | Los filtros de historial muestran su selección con `aria-pressed`. |
| PE02 | Cada enlace de detalle identifica el número de pedido. |
| PE03 | El indicador se genera a partir del estado del pedido, sin fijar siempre Recibido. |
| S01 | El seguimiento contiene un único formulario válido con número, correo y botón de envío. |
| S02 | Un resumen breve anuncia el resultado y el pedido encontrado recibe foco en su encabezado. |
| N01 | El proceso de origen se representa mediante `ol` y cinco elementos `li`. |
| A01 | Un resumen de FAQ informa la cantidad encontrada tras filtrar, buscar o restablecer. |

## Comprobaciones realizadas

`npm test` ejecuta las comprobaciones de negocio existentes y `verificar-accesibilidad.cjs`, que utiliza JSDOM para probar eventos y formularios con un DOM estructurado. La herramienta de pruebas es una dependencia de desarrollo; no se carga en la tienda publicada.

Se comprobó:

- Un título principal, identificadores únicos y jerarquía de encabezados en vistas de acceso libre y sus estados vacíos; también en checkout, direcciones y pedidos con datos.
- Conservación de foco en filtros, paginación, cantidad y eliminación de carrito.
- Formulario de seguimiento con exactamente dos campos y su botón, y envío de compra invitada seguido de consulta.
- Validación y descripción de errores de correo, teléfono, selección de entrega y autenticación.
- Los cuatro estados del progreso de pedido y los atributos de selección de controles.
- Conservación de ayuda, favorito pendiente tras registro o acceso, pestañas del producto y perfil numérico de diez puntos.
- En el navegador, flujo Producto, Carrito, Checkout, Confirmación y Seguimiento con datos ficticios y acciones de teclado. El resultado fue un pedido de prueba recuperable por número y correo, con foco y mensajes correctos y sin errores en consola.
- Inicio en anchos de 1280, 1024, 853, 731, 640 y 320 px. Son anchos equivalentes de reflujo para una ventana de referencia de 1280 px a ampliaciones de 100, 125, 150, 175, 200 y 400 por ciento; no se presenta esta comprobación como medición del zoom nativo de todos los navegadores.
- A 320 px, Inicio, Tienda, Categoría, Producto, Acceso, Seguimiento, Ayuda, Nosotros, Carrito, Checkout y Confirmación sin desbordamiento horizontal del documento. La fila de pestañas conserva desplazamiento horizontal local cuando lo necesita.

## Alcance de la verificación

Las pruebas confirman comportamiento y semántica de las correcciones, pero no sustituyen pruebas manuales con lectores de pantalla reales, ampliación nativa y ajustes de texto del sistema en varias plataformas. No se afirma conformidad total WCAG AA. También continúan pendientes las integraciones comerciales de servidor, correo, pagos y logística; no se simulan como servicios existentes.

Los estados de pedido se representan correctamente si los datos cambian, pero la tienda estática no recibe actualizaciones reales de un transportista.

## Referencias técnicas

- W3C. Contraste mínimo y definición de texto grande: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- W3C. Patrón de pestañas y teclado: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- W3C. WCAG 2.2: https://www.w3.org/TR/WCAG22/
