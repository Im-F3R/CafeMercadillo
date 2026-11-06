CREATE OR REPLACE FUNCTION public.crear_perfil_cliente()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
   v_codigo varchar(10);
   v_rol numeric(3);
   v_nombre text;
   v_apellido text;
   v_telefono text;
begin
   if new.email is null or new.email = '' then
      raise exception 'El registro requiere un correo electrónico';
   end if;

   select rol_codigo__
   into strict v_rol
   from public.rol
   where upper(trim(rol_nombre__)) = 'CLIENTE'
     and rol_estado__ = 'A';

   v_nombre := nullif(
      trim(new.raw_user_meta_data ->> 'nombre'),
      ''
   );

   v_apellido := nullif(trim(new.raw_user_meta_data ->> 'apellido'), '');
   if length(v_apellido) > 100 then raise exception 'El apellido no puede superar 100 caracteres'; end if;
   v_telefono := nullif(
      trim(new.raw_user_meta_data ->> 'telefono'),
      ''
   );

   if v_telefono is not null
      and v_telefono !~ '^[0-9]{10}$' then
      raise exception 'El teléfono debe contener 10 dígitos';
   end if;

   if length(v_nombre) > 100 then
      raise exception 'El nombre no puede superar 100 caracteres';
   end if;

   loop
      v_codigo := 'U' || lpad(
         nextval('public.usuario_codigo_seq'::regclass)::text,
         9,
         '0'
      );

      insert into public.usuario (
         usr_codigo__,
         usr_auth_id,
         usr_nombre__,
         usr_apellido,
         usr_correo__,
         usr_telefono__,
         usr_fecha_registro__,
         usr_estado__
      )
      values (
         v_codigo,
         new.id,
         v_nombre,
         v_apellido,
         new.email,
         v_telefono,
         current_date,
         'A'
      )
      on conflict (usr_codigo__) do nothing;

      exit when found;
   end loop;

   insert into public.usuario_rol (
      rol_codigo__,
      usr_codigo__,
      usrl_fecha_asignacion__
   )
   values (
      v_rol,
      v_codigo,
      current_date
   );

   return new;
end;
$function$;
