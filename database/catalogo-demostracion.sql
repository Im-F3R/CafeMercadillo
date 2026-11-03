begin;

insert into public.unidad_medida (
   unm_codigo__,
   unm_nombre__,
   unm_abreviatura__,
   unm_tipo
)
values
   ('G', 'Gramo', 'g', 'PESO'),
   ('UND', 'Unidad', 'ud', 'UNIDAD')
on conflict (unm_codigo__) do nothing;

insert into public.categoria (
   cat_codigo__,
   cat_nombre__,
   cat_descripcion__,
   cat_estado__
)
values
   ('CAF', 'Café', 'Café de Mercadillo y Alamor.', 'A'),
   ('DUL', 'Dulces', 'Dulces del catálogo de Café Mercadillo.', 'A'),
   ('TRA', 'Tradicionales', 'Productos tradicionales del catálogo de Café Mercadillo.', 'A'),
   ('REG', 'Regalos', 'Cajas, packs y kits para regalar.', 'A')
on conflict (cat_codigo__) do nothing;

insert into public.producto (
   prd_codigo__,
   cat_codigo__,
   prd_nombre__,
   prd_descripcion__,
   prd_imagen_url__,
   prd_iva_porcentaje__,
   prd_estado__
)
values
   ('P0000001', 'CAF', 'Café Premium Loja', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Tostado oscuro, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000002', 'CAF', 'Café de altura Alamor', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000003', 'CAF', 'Café de origen Mercadillo', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000005', 'CAF', 'Café especial Mercadillo', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000006', 'CAF', 'Café intenso Alamor', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000007', 'CAF', 'Café suave Mercadillo', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Tostado oscuro, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000008', 'CAF', 'Café orgánico Loja', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000009', 'CAF', 'Café reserva de altura', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000010', 'CAF', 'Pack café de origen', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Tostado oscuro, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000011', 'CAF', 'Café descafeinado', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000012', 'CAF', 'Café tostado artesanal', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Tostado medio, perfil equilibrado y notas aromáticas. Pesos disponibles: 250 g, 450 g y 900 g.
Preparación recomendada: Para café filtrado, utiliza aproximadamente 15 g de café por cada 250 ml de agua. Ajusta la proporción a tu gusto.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000013', 'DUL', 'Bocadillos lojanos', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000014', 'DUL', 'Dulce de guayaba', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000015', 'DUL', 'Roscones tradicionales', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000016', 'DUL', 'Dulce de leche artesanal', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000017', 'TRA', 'Horchata lojana', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000018', 'TRA', 'Miel de abeja', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000019', 'TRA', 'Panela artesanal', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000020', 'TRA', 'Infusión de hierbas', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000021', 'REG', 'Caja sabores de Loja', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000022', 'REG', 'Regalo para amantes del café', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000023', 'REG', 'Pack tradición lojana', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Mercadillo, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85', 0, 'A'),
   ('P0000024', 'REG', 'Kit de café y taza', 'Descripción: Una selección artesanal para disfrutar el sabor y la tradición lojana.
Origen: Origen de referencia: Alamor, provincia de Loja, Ecuador.
Características: Producto tradicional seleccionado. Presentación: Unidad.
Preparación recomendada: Disfruta el producto según su presentación y consulta las indicaciones de su envase.
Conservación: Conserva en un lugar fresco y seco, protegido del sol y en un envase bien cerrado.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85', 0, 'A')
on conflict (prd_codigo__) do nothing;

insert into public.presentacion (
   prd_codigo__,
   pre_codigo__,
   unm_codigo__,
   pre_nombre__,
   pre_cantidad__,
   pre_molienda__,
   pre_precio__,
   pre_stock__,
   pre_estado__
)
values
   ('P0000001', 'V0000101', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 8.5, NULL, 'A'),
   ('P0000001', 'V0000102', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 8.5, NULL, 'A'),
   ('P0000001', 'V0000103', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 8.5, NULL, 'A'),
   ('P0000001', 'V0000104', 'G', 'Bolsa', 250, 'EN_GRANO', 8.93, NULL, 'A'),
   ('P0000001', 'V0000105', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 15.3, NULL, 'A'),
   ('P0000001', 'V0000106', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 15.3, NULL, 'A'),
   ('P0000001', 'V0000107', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 15.3, NULL, 'A'),
   ('P0000001', 'V0000108', 'G', 'Bolsa', 450, 'EN_GRANO', 16.07, NULL, 'A'),
   ('P0000001', 'V0000109', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 30.6, NULL, 'A'),
   ('P0000001', 'V0000110', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 30.6, NULL, 'A'),
   ('P0000001', 'V0000111', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 30.6, NULL, 'A'),
   ('P0000001', 'V0000112', 'G', 'Bolsa', 900, 'EN_GRANO', 32.13, NULL, 'A'),
   ('P0000002', 'V0000201', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 10.5, NULL, 'A'),
   ('P0000002', 'V0000202', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 10.5, NULL, 'A'),
   ('P0000002', 'V0000203', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 10.5, NULL, 'A'),
   ('P0000002', 'V0000204', 'G', 'Bolsa', 250, 'EN_GRANO', 11.03, NULL, 'A'),
   ('P0000002', 'V0000205', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 18.9, NULL, 'A'),
   ('P0000002', 'V0000206', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 18.9, NULL, 'A'),
   ('P0000002', 'V0000207', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 18.9, NULL, 'A'),
   ('P0000002', 'V0000208', 'G', 'Bolsa', 450, 'EN_GRANO', 19.85, NULL, 'A'),
   ('P0000002', 'V0000209', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 37.8, NULL, 'A'),
   ('P0000002', 'V0000210', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 37.8, NULL, 'A'),
   ('P0000002', 'V0000211', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 37.8, NULL, 'A'),
   ('P0000002', 'V0000212', 'G', 'Bolsa', 900, 'EN_GRANO', 39.69, NULL, 'A'),
   ('P0000003', 'V0000301', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 9, NULL, 'A'),
   ('P0000003', 'V0000302', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 9, NULL, 'A'),
   ('P0000003', 'V0000303', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 9, NULL, 'A'),
   ('P0000003', 'V0000304', 'G', 'Bolsa', 250, 'EN_GRANO', 9.45, NULL, 'A'),
   ('P0000003', 'V0000305', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 16.2, NULL, 'A'),
   ('P0000003', 'V0000306', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 16.2, NULL, 'A'),
   ('P0000003', 'V0000307', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 16.2, NULL, 'A'),
   ('P0000003', 'V0000308', 'G', 'Bolsa', 450, 'EN_GRANO', 17.01, NULL, 'A'),
   ('P0000003', 'V0000309', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 32.4, NULL, 'A'),
   ('P0000003', 'V0000310', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 32.4, NULL, 'A'),
   ('P0000003', 'V0000311', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 32.4, NULL, 'A'),
   ('P0000003', 'V0000312', 'G', 'Bolsa', 900, 'EN_GRANO', 34.02, NULL, 'A'),
   ('P0000005', 'V0000501', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 11, NULL, 'A'),
   ('P0000005', 'V0000502', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 11, NULL, 'A'),
   ('P0000005', 'V0000503', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 11, NULL, 'A'),
   ('P0000005', 'V0000504', 'G', 'Bolsa', 250, 'EN_GRANO', 11.55, NULL, 'A'),
   ('P0000005', 'V0000505', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 19.8, NULL, 'A'),
   ('P0000005', 'V0000506', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 19.8, NULL, 'A'),
   ('P0000005', 'V0000507', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 19.8, NULL, 'A'),
   ('P0000005', 'V0000508', 'G', 'Bolsa', 450, 'EN_GRANO', 20.79, NULL, 'A'),
   ('P0000005', 'V0000509', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 39.6, NULL, 'A'),
   ('P0000005', 'V0000510', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 39.6, NULL, 'A'),
   ('P0000005', 'V0000511', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 39.6, NULL, 'A'),
   ('P0000005', 'V0000512', 'G', 'Bolsa', 900, 'EN_GRANO', 41.58, NULL, 'A'),
   ('P0000006', 'V0000601', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 7.5, NULL, 'A'),
   ('P0000006', 'V0000602', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 7.5, NULL, 'A'),
   ('P0000006', 'V0000603', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 7.5, NULL, 'A'),
   ('P0000006', 'V0000604', 'G', 'Bolsa', 250, 'EN_GRANO', 7.88, NULL, 'A'),
   ('P0000006', 'V0000605', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 13.5, NULL, 'A'),
   ('P0000006', 'V0000606', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 13.5, NULL, 'A'),
   ('P0000006', 'V0000607', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 13.5, NULL, 'A'),
   ('P0000006', 'V0000608', 'G', 'Bolsa', 450, 'EN_GRANO', 14.18, NULL, 'A'),
   ('P0000006', 'V0000609', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 27, NULL, 'A'),
   ('P0000006', 'V0000610', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 27, NULL, 'A'),
   ('P0000006', 'V0000611', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 27, NULL, 'A'),
   ('P0000006', 'V0000612', 'G', 'Bolsa', 900, 'EN_GRANO', 28.35, NULL, 'A'),
   ('P0000007', 'V0000701', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 8, NULL, 'A'),
   ('P0000007', 'V0000702', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 8, NULL, 'A'),
   ('P0000007', 'V0000703', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 8, NULL, 'A'),
   ('P0000007', 'V0000704', 'G', 'Bolsa', 250, 'EN_GRANO', 8.4, NULL, 'A'),
   ('P0000007', 'V0000705', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 14.4, NULL, 'A'),
   ('P0000007', 'V0000706', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 14.4, NULL, 'A'),
   ('P0000007', 'V0000707', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 14.4, NULL, 'A'),
   ('P0000007', 'V0000708', 'G', 'Bolsa', 450, 'EN_GRANO', 15.12, NULL, 'A'),
   ('P0000007', 'V0000709', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 28.8, NULL, 'A'),
   ('P0000007', 'V0000710', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 28.8, NULL, 'A'),
   ('P0000007', 'V0000711', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 28.8, NULL, 'A'),
   ('P0000007', 'V0000712', 'G', 'Bolsa', 900, 'EN_GRANO', 30.24, NULL, 'A'),
   ('P0000008', 'V0000801', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 13, NULL, 'A'),
   ('P0000008', 'V0000802', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 13, NULL, 'A'),
   ('P0000008', 'V0000803', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 13, NULL, 'A'),
   ('P0000008', 'V0000804', 'G', 'Bolsa', 250, 'EN_GRANO', 13.65, NULL, 'A'),
   ('P0000008', 'V0000805', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 23.4, NULL, 'A'),
   ('P0000008', 'V0000806', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 23.4, NULL, 'A'),
   ('P0000008', 'V0000807', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 23.4, NULL, 'A'),
   ('P0000008', 'V0000808', 'G', 'Bolsa', 450, 'EN_GRANO', 24.57, NULL, 'A'),
   ('P0000008', 'V0000809', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 46.8, NULL, 'A'),
   ('P0000008', 'V0000810', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 46.8, NULL, 'A'),
   ('P0000008', 'V0000811', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 46.8, NULL, 'A'),
   ('P0000008', 'V0000812', 'G', 'Bolsa', 900, 'EN_GRANO', 49.14, NULL, 'A'),
   ('P0000009', 'V0000901', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 14, NULL, 'A'),
   ('P0000009', 'V0000902', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 14, NULL, 'A'),
   ('P0000009', 'V0000903', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 14, NULL, 'A'),
   ('P0000009', 'V0000904', 'G', 'Bolsa', 250, 'EN_GRANO', 14.7, NULL, 'A'),
   ('P0000009', 'V0000905', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 25.2, NULL, 'A'),
   ('P0000009', 'V0000906', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 25.2, NULL, 'A'),
   ('P0000009', 'V0000907', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 25.2, NULL, 'A'),
   ('P0000009', 'V0000908', 'G', 'Bolsa', 450, 'EN_GRANO', 26.46, NULL, 'A'),
   ('P0000009', 'V0000909', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 50.4, NULL, 'A'),
   ('P0000009', 'V0000910', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 50.4, NULL, 'A'),
   ('P0000009', 'V0000911', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 50.4, NULL, 'A'),
   ('P0000009', 'V0000912', 'G', 'Bolsa', 900, 'EN_GRANO', 52.92, NULL, 'A'),
   ('P0000010', 'V0001001', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 22, NULL, 'A'),
   ('P0000010', 'V0001002', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 22, NULL, 'A'),
   ('P0000010', 'V0001003', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 22, NULL, 'A'),
   ('P0000010', 'V0001004', 'G', 'Bolsa', 250, 'EN_GRANO', 23.1, NULL, 'A'),
   ('P0000010', 'V0001005', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 39.6, NULL, 'A'),
   ('P0000010', 'V0001006', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 39.6, NULL, 'A'),
   ('P0000010', 'V0001007', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 39.6, NULL, 'A'),
   ('P0000010', 'V0001008', 'G', 'Bolsa', 450, 'EN_GRANO', 41.58, NULL, 'A'),
   ('P0000010', 'V0001009', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 79.2, NULL, 'A'),
   ('P0000010', 'V0001010', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 79.2, NULL, 'A'),
   ('P0000010', 'V0001011', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 79.2, NULL, 'A'),
   ('P0000010', 'V0001012', 'G', 'Bolsa', 900, 'EN_GRANO', 83.16, NULL, 'A'),
   ('P0000011', 'V0001101', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 10, NULL, 'A'),
   ('P0000011', 'V0001102', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 10, NULL, 'A'),
   ('P0000011', 'V0001103', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 10, NULL, 'A'),
   ('P0000011', 'V0001104', 'G', 'Bolsa', 250, 'EN_GRANO', 10.5, NULL, 'A'),
   ('P0000011', 'V0001105', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 18, NULL, 'A'),
   ('P0000011', 'V0001106', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 18, NULL, 'A'),
   ('P0000011', 'V0001107', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 18, NULL, 'A'),
   ('P0000011', 'V0001108', 'G', 'Bolsa', 450, 'EN_GRANO', 18.9, NULL, 'A'),
   ('P0000011', 'V0001109', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 36, NULL, 'A'),
   ('P0000011', 'V0001110', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 36, NULL, 'A'),
   ('P0000011', 'V0001111', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 36, NULL, 'A'),
   ('P0000011', 'V0001112', 'G', 'Bolsa', 900, 'EN_GRANO', 37.8, NULL, 'A'),
   ('P0000012', 'V0001201', 'G', 'Bolsa', 250, 'MOLIDO_MEDIA', 9.5, NULL, 'A'),
   ('P0000012', 'V0001202', 'G', 'Bolsa', 250, 'MOLIDO_FINA', 9.5, NULL, 'A'),
   ('P0000012', 'V0001203', 'G', 'Bolsa', 250, 'MOLIDO_GRUESA', 9.5, NULL, 'A'),
   ('P0000012', 'V0001204', 'G', 'Bolsa', 250, 'EN_GRANO', 9.98, NULL, 'A'),
   ('P0000012', 'V0001205', 'G', 'Bolsa', 450, 'MOLIDO_MEDIA', 17.1, NULL, 'A'),
   ('P0000012', 'V0001206', 'G', 'Bolsa', 450, 'MOLIDO_FINA', 17.1, NULL, 'A'),
   ('P0000012', 'V0001207', 'G', 'Bolsa', 450, 'MOLIDO_GRUESA', 17.1, NULL, 'A'),
   ('P0000012', 'V0001208', 'G', 'Bolsa', 450, 'EN_GRANO', 17.96, NULL, 'A'),
   ('P0000012', 'V0001209', 'G', 'Bolsa', 900, 'MOLIDO_MEDIA', 34.2, NULL, 'A'),
   ('P0000012', 'V0001210', 'G', 'Bolsa', 900, 'MOLIDO_FINA', 34.2, NULL, 'A'),
   ('P0000012', 'V0001211', 'G', 'Bolsa', 900, 'MOLIDO_GRUESA', 34.2, NULL, 'A'),
   ('P0000012', 'V0001212', 'G', 'Bolsa', 900, 'EN_GRANO', 35.91, NULL, 'A'),
   ('P0000013', 'V0001301', 'UND', 'Unidad', 1, 'NO_APLICA', 4.5, NULL, 'A'),
   ('P0000014', 'V0001401', 'UND', 'Unidad', 1, 'NO_APLICA', 5, NULL, 'A'),
   ('P0000015', 'V0001501', 'UND', 'Unidad', 1, 'NO_APLICA', 3.5, NULL, 'A'),
   ('P0000016', 'V0001601', 'UND', 'Unidad', 1, 'NO_APLICA', 6, NULL, 'A'),
   ('P0000017', 'V0001701', 'UND', 'Unidad', 1, 'NO_APLICA', 4, NULL, 'A'),
   ('P0000018', 'V0001801', 'UND', 'Unidad', 1, 'NO_APLICA', 7, NULL, 'A'),
   ('P0000019', 'V0001901', 'UND', 'Unidad', 1, 'NO_APLICA', 3, 0, 'A'),
   ('P0000020', 'V0002001', 'UND', 'Unidad', 1, 'NO_APLICA', 4.5, NULL, 'A'),
   ('P0000021', 'V0002101', 'UND', 'Unidad', 1, 'NO_APLICA', 25, NULL, 'A'),
   ('P0000022', 'V0002201', 'UND', 'Unidad', 1, 'NO_APLICA', 29, NULL, 'A'),
   ('P0000023', 'V0002301', 'UND', 'Unidad', 1, 'NO_APLICA', 24, NULL, 'A'),
   ('P0000024', 'V0002401', 'UND', 'Unidad', 1, 'NO_APLICA', 18, NULL, 'A')
on conflict (pre_codigo__) do nothing;

commit;
