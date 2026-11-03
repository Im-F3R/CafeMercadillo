# Ampliación del catálogo de demostración

Revisión del 3 de noviembre de 2026. Se proponen seis dulces, seis productos tradicionales y seis regalos. Café conserva sus once productos. Los precios, existencias de diez unidades y composiciones de regalos son ficticios; no representan ofertas verificadas ni proveedores confirmados de Mercadillo o Alamor. Las imágenes son referencias de categoría reutilizadas, pendientes de fotografía propia.

## Referencias para la selección

- [GAD Cangonamá — Comidas típicas](https://www.gadcangonama.gob.ec/index.php/ct-menu-item-53/ct-menu-item-57): referencia regional de bizcochuelos y amasijos.
- [Ministerio de Turismo — Quesadillas](https://historicomintur.produccion.gob.ec/quesadillas-una-delicada-tradicion-gastronomica/): referencia de la repostería ecuatoriana; no demuestra procedencia de los productos de esta tienda.
- [GAD San Antonio de Paltas — Comercial](https://sanantoniodepaltas.gob.ec/comercial/): referencia provincial de maní, maíz, fréjol, panela, bocadillos y faldiqueras.
- [UTPL — Monografía del cantón Loja](https://dspace.utpl.edu.ec/bitstream/123456789/4696/1/1074400.pdf): contexto gastronómico de quesadillas y bizcochuelos.

Suspiros, cocadas, galletas y chocolate complementan la propuesta de surtido; no se presentan como exclusivos de Loja. Los seis regalos son combinaciones diseñadas para este prototipo. No hay recetas, certificados, impuestos, alérgenos ni caducidades comerciales validados.

## Carga

`node scripts/preparar-ampliacion-catalogo.cjs` genera `database/ampliacion-catalogo.sql` a partir del JSON. La carga agrega productos y presentaciones sin sobrescribir registros existentes ni reponer stock al repetir el script. Cada paquete se vende como una unidad y su contenido se describe en la ficha.
