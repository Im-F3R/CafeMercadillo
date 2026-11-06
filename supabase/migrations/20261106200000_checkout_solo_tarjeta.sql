begin;
update public.metodo_pago set met_estado__ = 'I' where met_codigo__ in ('TRANSF', 'CONTRA');
insert into public.metodo_pago (met_codigo__, met_nombre__, met_descripcion__, met_estado__) values
('TARJDEMO', 'Tarjeta de prueba', 'Simulación académica de aprobación o rechazo. Sin cargos reales.', 'A'),
('PAYPAL', 'PayPal', 'Método deshabilitado en la demostración.', 'I')
on conflict (met_codigo__) do update set met_nombre__ = excluded.met_nombre__, met_descripcion__ = excluded.met_descripcion__, met_estado__ = excluded.met_estado__;

create or replace function public.tienda_operacion(p_accion text, p_datos jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
   v_usuario public.usuario;
   v_carrito text;
   v_codigo text;
   v_direccion text;
   v_pedido text;
   v_cobro text;
   v_cantidad integer;
   v_variante public.presentacion;
   v_linea record;
   v_subtotal numeric(12,2) := 0;
   v_envio numeric(10,2);
   v_total numeric(12,2);
   v_items jsonb := '[]'::jsonb;
   v_resumen jsonb;
begin
   select * into v_usuario from public.usuario
   where usr_auth_id = auth.uid() and usr_estado__ = 'A' for update;
   if not found then raise exception 'Inicia sesión con una cuenta activa'; end if;

   if p_accion = 'perfil' then
      if length(trim(coalesce(p_datos->>'nombre', ''))) not between 1 and 100
         or length(coalesce(p_datos->>'apellido', '')) > 100 then
         raise exception 'Revisa el nombre y apellido';
      end if;
      if coalesce(p_datos->>'telefono', '') <> '' and (p_datos->>'telefono') !~ '^[0-9]{10}$' then
         raise exception 'El teléfono debe contener 10 dígitos';
      end if;
      update public.usuario set usr_nombre__ = trim(p_datos->>'nombre'),
         usr_apellido = p_datos->>'apellido', usr_telefono__ = nullif(p_datos->>'telefono', '')
      where usr_codigo__ = v_usuario.usr_codigo__;

   elsif p_accion = 'favorito' then
      if (p_datos->>'guardar')::boolean then
         if not exists (select 1 from public.producto where prd_codigo__ = p_datos->>'producto' and prd_estado__ = 'A') then
            raise exception 'Producto no disponible';
         end if;
         insert into public.favorito values(v_usuario.usr_codigo__, p_datos->>'producto', current_date)
         on conflict do nothing;
      else
         delete from public.favorito where usr_codigo__ = v_usuario.usr_codigo__ and prd_codigo__ = p_datos->>'producto';
      end if;

   elsif p_accion = 'direccion' then
      if length(trim(coalesce(p_datos->>'provincia', ''))) not between 1 and 35
         or length(trim(coalesce(p_datos->>'ciudad', ''))) not between 1 and 35
         or length(trim(coalesce(p_datos->>'direccion', ''))) not between 1 and 120
         or length(coalesce(p_datos->>'referencia', '')) > 60 then
         raise exception 'Revisa la provincia, ciudad, dirección y referencia (máximo 60 caracteres)';
      end if;
      v_codigo := nullif(p_datos->>'codigo', '');
      if v_codigo is null then
         v_codigo := 'D' || lpad(nextval('public.tienda_codigo_seq')::text, 9, '0');
         insert into public.direccion(dir_codigo__, usr_codigo__, dir_provincia__, dir_ciudad__, dir_calle_principal__, dir_referencia__)
         values(v_codigo, v_usuario.usr_codigo__, p_datos->>'provincia', p_datos->>'ciudad', p_datos->>'direccion', p_datos->>'referencia');
      else
         update public.direccion set dir_provincia__ = p_datos->>'provincia', dir_ciudad__ = p_datos->>'ciudad',
            dir_calle_principal__ = p_datos->>'direccion', dir_referencia__ = p_datos->>'referencia'
         where dir_codigo__ = v_codigo and usr_codigo__ = v_usuario.usr_codigo__;
         if not found then raise exception 'Dirección no encontrada'; end if;
      end if;

   elsif p_accion = 'eliminar_direccion' then
      if exists (select 1 from public.pedido where dir_codigo__ = p_datos->>'codigo' and usr_codigo__ = v_usuario.usr_codigo__) then
         raise exception 'Esta dirección está vinculada a un pedido y debe conservarse';
      end if;
      delete from public.direccion where dir_codigo__ = p_datos->>'codigo' and usr_codigo__ = v_usuario.usr_codigo__;

   elsif p_accion = 'opinion' then
      if coalesce(p_datos->>'calificacion', '') !~ '^[1-5]$'
         or length(trim(coalesce(p_datos->>'comentario', ''))) not between 1 and 500 then
         raise exception 'La opinión requiere una valoración de 1 a 5 y hasta 500 caracteres';
      end if;
      if not exists(select 1 from public.producto where prd_codigo__ = p_datos->>'producto' and prd_estado__ = 'A') then
         raise exception 'Producto no disponible';
      end if;
      insert into public.resena values(nextval('public.tienda_codigo_seq'), v_usuario.usr_codigo__,
         p_datos->>'producto', (p_datos->>'calificacion')::integer, trim(p_datos->>'comentario'), current_date);

   elsif p_accion in ('carrito', 'pedido') then
      select car_codigo__ into v_carrito from public.carrito
      where usr_codigo__ = v_usuario.usr_codigo__ and car_estado__ = 'ACTIVO'
      order by car_codigo__ limit 1 for update;

      if p_accion = 'carrito' then
         if coalesce(p_datos->>'cantidad', '') !~ '^[0-9]{1,2}$' then raise exception 'Cantidad inválida'; end if;
         v_cantidad := (p_datos->>'cantidad')::integer;
         if v_carrito is null then
            v_carrito := 'C' || lpad(nextval('public.tienda_codigo_seq')::text, 9, '0');
            insert into public.carrito values(v_carrito, v_usuario.usr_codigo__, current_date, current_date, 'ACTIVO');
         end if;
         if v_cantidad = 0 then
            delete from public.detalle_carrito where car_codigo__ = v_carrito and pre_codigo__ = p_datos->>'presentacion';
         else
            select * into v_variante from public.presentacion where pre_codigo__ = p_datos->>'presentacion' for update;
            if not found or v_variante.pre_estado__ <> 'A' or v_variante.pre_precio__ is null
               or coalesce(v_variante.pre_stock__, 0) < v_cantidad
               or not exists(select 1 from public.producto p join public.categoria c on c.cat_codigo__ = p.cat_codigo__
                  where p.prd_codigo__ = v_variante.prd_codigo__ and p.prd_estado__ = 'A' and c.cat_estado__ = 'A') then
               raise exception 'Esta presentación no tiene existencias confirmadas suficientes';
            end if;
            insert into public.detalle_carrito values(v_variante.pre_codigo__, v_carrito, v_cantidad, current_date)
            on conflict(pre_codigo__, car_codigo__) do update set dca_cantidad__ = excluded.dca_cantidad__;
         end if;
         update public.carrito set car_fecha_actualizacion__ = current_date where car_codigo__ = v_carrito;
      else
         if nullif(p_datos->>'solicitud', '') is null then raise exception 'Falta el identificador del pedido'; end if;
         select ped_codigo__ into v_pedido from public.pedido
         where ped_solicitud = (p_datos->>'solicitud')::uuid and usr_codigo__ = v_usuario.usr_codigo__;
         if found then return jsonb_build_object('pedido', v_pedido); end if;
         if v_carrito is null or not exists(select 1 from public.detalle_carrito where car_codigo__ = v_carrito) then
            raise exception 'El carrito está vacío';
         end if;
         if coalesce(p_datos->>'telefono', '') !~ '^[0-9]{10}$'
            or length(trim(coalesce(p_datos->>'nombre', ''))) not between 1 and 100
            or length(trim(coalesce(p_datos->>'direccion', ''))) not between 1 and 120
            or length(trim(coalesce(p_datos->>'provincia', ''))) not between 1 and 35
            or length(trim(coalesce(p_datos->>'ciudad', ''))) not between 1 and 35
            or length(coalesce(p_datos->>'referencia', '')) > 60 then raise exception 'Revisa los datos de entrega'; end if;
         if coalesce(p_datos->>'metodo', '') <> 'TARJDEMO' or not exists(select 1 from public.metodo_pago where met_codigo__ = p_datos->>'metodo' and met_estado__ = 'A') then
            raise exception 'Método de pago no disponible';
         end if;
         if p_datos->>'metodo' = 'PAYPAL' then
            raise exception 'PayPal no está disponible';
         end if;
         if p_datos->>'metodo' = 'TARJDEMO' then
            if coalesce(p_datos->>'simulacion', '') not in ('APROBADO', 'RECHAZADO') then
               raise exception 'Selecciona el resultado de la tarjeta de prueba';
            end if;
            if p_datos->>'simulacion' = 'RECHAZADO' then
               raise exception 'Pago de prueba rechazado. No se creó ningún pedido ni se descontó stock. Selecciona aprobar para reintentar.';
            end if;
         end if;
         for v_linea in
            select d.*, p.pre_precio__, p.pre_stock__, p.pre_estado__, p.pre_cantidad__, p.pre_molienda__,
               p.unm_codigo__, r.prd_codigo__, r.prd_nombre__, r.prd_imagen_url__, r.prd_estado__, c.cat_estado__
            from public.detalle_carrito d join public.presentacion p on p.pre_codigo__ = d.pre_codigo__
            join public.producto r on r.prd_codigo__ = p.prd_codigo__ join public.categoria c on c.cat_codigo__ = r.cat_codigo__
            where d.car_codigo__ = v_carrito order by p.pre_codigo__ for update of p
         loop
            if v_linea.pre_estado__ <> 'A' or v_linea.prd_estado__ <> 'A' or v_linea.cat_estado__ <> 'A'
               or v_linea.pre_precio__ is null or v_linea.pre_precio__ < 0 or v_linea.dca_cantidad__ < 1
               or coalesce(v_linea.pre_stock__, 0) < v_linea.dca_cantidad__ then
               raise exception 'Un producto ya no tiene existencias suficientes. Actualiza tu carrito';
            end if;
            v_subtotal := v_subtotal + v_linea.pre_precio__ * v_linea.dca_cantidad__;
            v_items := v_items || jsonb_build_array(jsonb_build_object('producto', v_linea.prd_codigo__,
               'presentacion', v_linea.pre_codigo__, 'nombre', v_linea.prd_nombre__, 'imagen', v_linea.prd_imagen_url__,
               'cantidad', v_linea.dca_cantidad__, 'precio', v_linea.pre_precio__, 'contenido', v_linea.pre_cantidad__,
               'unidad', v_linea.unm_codigo__, 'molienda', v_linea.pre_molienda__));
         end loop;
         v_envio := case when v_subtotal >= 35 then 0 else 3.5 end;
         v_total := v_subtotal + v_envio;
         v_pedido := 'CM-' || lpad(nextval('public.tienda_codigo_seq')::text, 9, '0');
         v_direccion := 'D' || lpad(nextval('public.tienda_codigo_seq')::text, 9, '0');
         v_cobro := 'O' || lpad(nextval('public.tienda_codigo_seq')::text, 9, '0');
         insert into public.direccion(dir_codigo__, usr_codigo__, dir_provincia__, dir_ciudad__, dir_calle_principal__, dir_referencia__)
         values(v_direccion, v_usuario.usr_codigo__, p_datos->>'provincia', p_datos->>'ciudad', p_datos->>'direccion', p_datos->>'referencia');
         v_resumen := jsonb_build_object('nombre', p_datos->>'nombre', 'telefono', p_datos->>'telefono',
            'direccion', p_datos->>'direccion', 'provincia', p_datos->>'provincia', 'ciudad', p_datos->>'ciudad',
            'referencia', p_datos->>'referencia', 'metodo', p_datos->>'metodo', 'items', v_items,
            'envio', v_envio, 'subtotal', v_subtotal, 'pago_simulado', p_datos->>'metodo' = 'TARJDEMO');
         insert into public.pedido(ped_codigo__, usr_codigo__, car_codigo__, dir_codigo__, ped_fecha__,
            ped_estado__, ped_subtotal__, ped_costo_envio__, ped_total__, ped_resumen, ped_solicitud)
         values(v_pedido, v_usuario.usr_codigo__, v_carrito, v_direccion, current_date, 'Recibido',
            v_subtotal, v_envio, v_total, v_resumen, (p_datos->>'solicitud')::uuid);
         insert into public.detalle_pedido(pre_codigo__, ped_codigo__, dpe_descripcion__, dpe_cantidad__, dpe_precio_unitario__)
         select x->>'presentacion', v_pedido, left(x->>'nombre', 160), (x->>'cantidad')::integer, (x->>'precio')::numeric
         from jsonb_array_elements(v_items) x;
         update public.presentacion p set pre_stock__ = p.pre_stock__ - (x->>'cantidad')::integer
         from jsonb_array_elements(v_items) x where p.pre_codigo__ = x->>'presentacion';
         insert into public.orden_cobro values(v_cobro, v_pedido, current_date, current_date + 7, v_total, case when p_datos->>'metodo' = 'TARJDEMO' then 'SIMULADO' else 'PENDIENTE' end);
         insert into public.pago(pag_codigo__, orc_codigo__, met_codigo__, pag_fecha__, pag_monto__, pag_estado__, pag_referencia__, pag_fecha_confirmacion__)
         values('G' || lpad(nextval('public.tienda_codigo_seq')::text, 9, '0'), v_cobro, p_datos->>'metodo', current_date, v_total,
            case when p_datos->>'metodo' = 'TARJDEMO' then 'SIMULADO' else 'PENDIENTE' end,
            case when p_datos->>'metodo' = 'TARJDEMO' then 'SIMULACION SIN CARGO REAL ' || v_pedido end,
            case when p_datos->>'metodo' = 'TARJDEMO' then current_date end);
         update public.carrito set car_estado__ = 'CONVERTIDO', car_fecha_actualizacion__ = current_date where car_codigo__ = v_carrito;
         return jsonb_build_object('pedido', v_pedido);
      end if;
   else
      raise exception 'Operación no permitida';
   end if;
   return jsonb_build_object('ok', true);
end;
$$;


revoke all on function public.tienda_operacion(text, jsonb) from public, anon;
grant execute on function public.tienda_operacion(text, jsonb) to authenticated;
commit;
