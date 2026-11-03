# Carga del catálogo de demostración

Abre `catalogo-demostracion.sql`, copia todo el contenido en una consulta nueva del SQL Editor de Supabase y pulsa Run. No vuelvas a ejecutar el script de creación de tablas.

El archivo contiene 2 unidades de medida, 4 categorías, 23 productos y 144 presentaciones. Está adaptado a los nombres y tipos del SQL ejecutado por Danny. No altera la estructura, las políticas ni la página web.

## Procedencia de los datos

- Productos, categorías, imágenes y disponibilidad: `js/datos.js`, lista activa `products`. Se excluye Blend Mercadillo, ID 4, aunque sigue en la lista histórica.
- Descripciones: apartados de `informacionProducto` en `js/tienda.js`. El origen, tostado y recomendaciones se conservan en la descripción porque el modelo actual no tiene columnas específicas para ellos.
- Precios: función `calcularPrecioVariante` de `js/tienda.js`. Los pesos de 250, 450 y 900 g usan factores 1, 1.8 y 3.6; el café en grano añade el 5 %. Se conserva el redondeo JavaScript de la web.
- Cada uno de los 11 cafés tiene 12 variantes: 3 pesos por 4 opciones (molido medio, fino, grueso y en grano). Los otros 12 productos tienen una presentación por unidad. No se trasladan las etiquetas erróneas de molienda del catálogo histórico a dulces, tradicionales o regalos.
- `PRE_NOMBRE__` indica Bolsa o Unidad; `PRE_MOLIENDA__` usa MOLIDO_MEDIA, MOLIDO_FINA, MOLIDO_GRUESA, EN_GRANO o NO_APLICA. Estos valores distinguen las opciones reales del selector. Al conectar la web habrá que traducir estas etiquetas al texto visible.

## Datos pendientes de confirmar

- Los precios de la web son de demostración; no se han confirmado como precios comerciales.
- La web solo tiene disponibilidad booleana. `PRE_STOCK__` queda en NULL cuando no hay cantidad conocida; Panela artesanal queda en 0 porque aparece agotada. NULL no significa inventario ilimitado ni autoriza ventas. Antes de habilitar compras se deben introducir existencias por variante y validar que sean suficientes.
- El IVA no está definido en la web. El campo obligatorio `PRD_IVA_PORCENTAJE__` se carga con 0 únicamente como valor provisional de demostración, no como determinación tributaria. Debe confirmarse por producto antes de ventas reales.
- Las imágenes son las mismas URLs de Unsplash de la demostración; no son fotos verificadas de los productos.
- No se crean reseñas, usuarios, pedidos ni descuentos ficticios.

## Repetición y códigos

Los códigos de producto conservan el ID de la web con prefijo P y siete dígitos: ID 1 corresponde a P0000001. Los códigos de variante usan prefijo V y siete dígitos derivados del ID del producto y la opción. La ausencia de P0000004 es intencional.

Los INSERT usan ON CONFLICT sobre la clave primaria con DO NOTHING: una segunda ejecución no duplica ni actualiza registros con los mismos códigos. Si ya hay datos propios con esos códigos, compáralos antes de cargar; el script los conservará. Tampoco deduplica registros con el mismo nombre y otro código. Se recomienda usarlo en las tablas de catálogo recién creadas y vacías.

La carga está dentro de una transacción: si falla una instrucción, no debe confirmarse una carga parcial. Si el editor deja una transacción abortada, ejecuta ROLLBACK antes de corregir y repetir.

## Comprobación

Ejecuta tras la carga:

```sql
select 'unidades' as tabla, count(*) as cantidad from public.unidad_medida
union all
select 'categorias', count(*) from public.categoria
union all
select 'productos', count(*) from public.producto
union all
select 'presentaciones', count(*) from public.presentacion;
```

En tablas inicialmente vacías: 2, 4, 23 y 144, respectivamente. Esta comprobación desde SQL Editor valida la carga; no prueba las políticas de acceso de un visitante.

El generador se ejecuta desde la raíz del proyecto con `node database/generar-catalogo.cjs`. Incluye comprobaciones de cantidades, claves, relaciones, longitudes y precios representativos. El SQL no se ha ejecutado contra tu proyecto de Supabase desde esta sesión.
