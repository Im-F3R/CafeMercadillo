create table CARRITO (
   CAR_CODIGO__         VARCHAR(20)          not null,
   USR_CODIGO__         VARCHAR(10)          not null,
   CAR_FECHA_CREACION__ DATE                 not null,
   CAR_FECHA_ACTUALIZACION__ DATE                 not null,
   CAR_ESTADO__         VARCHAR(15)          not null,
   constraint PK_CARRITO primary key (CAR_CODIGO__)
);

create table CATEGORIA (
   CAT_CODIGO__         VARCHAR(3)           not null,
   CAT_NOMBRE__         VARCHAR(100)         not null,
   CAT_DESCRIPCION__    VARCHAR(250)         not null,
   CAT_ESTADO__         VARCHAR(1)           not null,
   constraint PK_CATEGORIA primary key (CAT_CODIGO__)
);

create table DESCUENTO (
   DES_CODIGO__         NUMERIC(10)          not null,
   DES_NOMBRE__         VARCHAR(100)         not null,
   DES_CUPON__          VARCHAR(30)          not null,
   DES_TIPO__           VARCHAR(15)          not null,
   DES_VALOR__          NUMERIC(10,2)        not null,
   DES_FECHA_INICIO__   DATE                 not null,
   DES_FECHA_FIN__      DATE                 not null,
   DES_ESTADO__         VARCHAR(1)           not null,
   constraint PK_DESCUENTO primary key (DES_CODIGO__)
);

create table DETALLE_CARRITO (
   PRE_CODIGO__         VARCHAR(8)           not null,
   CAR_CODIGO__         VARCHAR(20)          not null,
   DCA_CANTIDAD__       NUMERIC(6)           not null,
   DCA_FECHA_AGREGADO__ DATE                 not null,
   constraint PK_DETALLE_CARRITO primary key (PRE_CODIGO__, CAR_CODIGO__)
);

create table DETALLE_PEDIDO (
   PRE_CODIGO__         VARCHAR(8)           not null,
   PED_CODIGO__         VARCHAR(20)          not null,
   DES_CODIGO__         NUMERIC(10)          not null,
   DPE_DESCRIPCION__    VARCHAR(160)         not null,
   DPE_CANTIDAD__       NUMERIC(5)           not null,
   DPE_PRECIO_UNITARIO__ NUMERIC(10,2)        not null,
   constraint PK_DETALLE_PEDIDO primary key (PRE_CODIGO__, PED_CODIGO__)
);

create table DIRECCION (
   DIR_CODIGO__         VARCHAR(10)          not null,
   USR_CODIGO__         VARCHAR(10)          not null,
   DIR_PROVINCIA__      VARCHAR(35)          not null,
   DIR_CIUDAD__         VARCHAR(35)          not null,
   DIR_CALLE_PRINCIPAL__ VARCHAR(120)         not null,
   DIR_CALLE_SECUNDARIA__ VARCHAR(120)         null,
   DIR_NUMERO__         VARCHAR(20)          null,
   DIR_REFERENCIA__     VARCHAR(60)          null,
   constraint PK_DIRECCION primary key (DIR_CODIGO__)
);

create table ENTREGA (
   ENT_CODIGO__         VARCHAR(20)          not null,
   PED_CODIGO__         VARCHAR(20)          NOT NULL UNIQUE,
   REP_CODIGO__         VARCHAR(10)          not null,
   ENT_RECEPTOR__       VARCHAR(100)         not null,
   ENT_TELEFONO__       VARCHAR(10)          not null,
   ENT_FECHA_ENTREGA__  DATE                 not null,
   ENT_OBSERVACION__    VARCHAR(500)         not null,
   constraint PK_ENTREGA primary key (ENT_CODIGO__)
);

create table ESTADO_ENTREGA (
   EST_CODIGO__         NUMERIC(10)          not null,
   EST_DESCRIPCION__    VARCHAR(30)          not null,
   constraint PK_ESTADO_ENTREGA primary key (EST_CODIGO__)
);

create table EVIDENCIA_ENTREGA (
   EVI_CODIGO__         NUMERIC(10)          not null,
   HIS_CODIGO__         NUMERIC(10)          not null,
   EVI_IMAGEN_URL__     VARCHAR(500)         null,
   EVI_FECHA__          DATE                 null,
   EVI_DESCRIPCION__    VARCHAR(500)         null,
   constraint PK_EVIDENCIA_ENTREGA primary key (EVI_CODIGO__)
);

create table FAVORITO (
   USR_CODIGO__         VARCHAR(10)          not null,
   PRD_CODIGO__         VARCHAR(8)           not null,
   FAV_FECHA__          DATE                 not null,
   constraint PK_FAVORITO primary key (USR_CODIGO__, PRD_CODIGO__)
);

create table HISTORIAL_ENTREGA (
   HIS_CODIGO__         NUMERIC(10)          not null,
   USR_CODIGO__         VARCHAR(10)          null,
   ENT_CODIGO__         VARCHAR(20)          not null,
   EST_CODIGO__         NUMERIC(10)          not null,
   HIS_FECHA__          DATE                 not null,
   HIS_OBSERVACION__    VARCHAR(500)         not null,
   constraint PK_HISTORIAL_ENTREGA primary key (HIS_CODIGO__)
);

create table METODO_PAGO (
   MET_CODIGO__         VARCHAR(10)          not null,
   MET_NOMBRE__         VARCHAR(50)          not null,
   MET_DESCRIPCION__    VARCHAR(250)         not null,
   MET_ESTADO__         VARCHAR(1)           not null,
   constraint PK_METODO_PAGO primary key (MET_CODIGO__)
);

create table ORDEN_COBRO (
   ORC_CODIGO__         VARCHAR(20)          not null,
   PED_CODIGO__         VARCHAR(20)          not null,
   ORC_FECHA_EMISION__  DATE                 not null,
   ORC_FECHA_VENCIMIENTO__ DATE                 not null,
   ORC_MONTO__          NUMERIC(10,2)        not null,
   ORC_ESTADO__         VARCHAR(15)          not null,
   constraint PK_ORDEN_COBRO primary key (ORC_CODIGO__)
);

create table PAGO (
   PAG_CODIGO__         VARCHAR(20)          not null,
   ORC_CODIGO__         VARCHAR(20)          not null,
   MET_CODIGO__         VARCHAR(10)          not null,
   PAG_FECHA__          DATE                 not null,
   PAG_MONTO__          NUMERIC(10,2)        not null,
   PAG_REFERENCIA__     VARCHAR(100)         null,
   PAG_ESTADO__         VARCHAR(15)          not null,
   PAG_FECHA_CONFIRMACION__ DATE                 not null,
   PAG_CODIGO_ERROR__   VARCHAR(30)          null,
   constraint PK_PAGO primary key (PAG_CODIGO__)
);

create table PEDIDO (
   PED_CODIGO__         VARCHAR(20)          not null,
   USR_CODIGO__         VARCHAR(10)          not null,
   CAR_CODIGO__         VARCHAR(20)          null,
   DES_CODIGO__         NUMERIC(10)          null,
   DIR_CODIGO__         VARCHAR(10)          not null,
   PED_FECHA__          DATE                 not null,
   PED_ESTADO__         VARCHAR(20)          not null,
   PED_SUBTOTAL__       NUMERIC(12,2)        not null,
   PED_COSTO_ENVIO__    NUMERIC(10,2)        not null,
   PED_TOTAL__          NUMERIC(12,2)        not null,
   constraint PK_PEDIDO primary key (PED_CODIGO__)
);

create table PRESENTACION (
   PRD_CODIGO__         VARCHAR(8)           not null,
   PRE_CODIGO__         VARCHAR(8)           not null,
   UNM_CODIGO__         VARCHAR(5)           not null,
   PRE_NOMBRE__         VARCHAR(60)          null,
   PRE_CANTIDAD__       NUMERIC(10,3)        null,
   PRE_MOLIENDA__       VARCHAR(20)          null,
   PRE_PRECIO__         NUMERIC(10,2)        null,
   PRE_STOCK__          NUMERIC(7)           null,
   PRE_ESTADO__         VARCHAR(1)           not null,
   constraint PK_PRESENTACION primary key (PRE_CODIGO__)
);

create table PRODUCTO (
   PRD_CODIGO__         VARCHAR(8)           not null,
   CAT_CODIGO__         VARCHAR(3)           not null,
   PRD_NOMBRE__         VARCHAR(100)         not null,
   PRD_DESCRIPCION__    VARCHAR(1000)        not null,
   PRD_IMAGEN_URL__     VARCHAR(500)         not null,
   PRD_IVA_PORCENTAJE__ NUMERIC(5,2)         not null,
   PRD_ESTADO__         VARCHAR(1)           not null,
   constraint PK_PRODUCTO primary key (PRD_CODIGO__)
);

create table REPARTIDOR (
   REP_CODIGO__         VARCHAR(10)          not null,
   USR_CODIGO__         VARCHAR(10)          not null,
   REP_TIPO_VEHICULO__  VARCHAR(30)          not null,
   REP_PLACA__          VARCHAR(15)          not null,
   constraint PK_REPARTIDOR primary key (REP_CODIGO__)
);

create table RESENA (
   RES_CODIGO__         NUMERIC(10)          not null,
   USR_CODIGO__         VARCHAR(10)          not null,
   PRD_CODIGO__         VARCHAR(8)           not null,
   RES_CALIFICACION__   NUMERIC              not null,
   RES_COMENTARIO__     VARCHAR(500)         not null,
   RES_FECHA__          DATE                 not null,
   constraint PK_RESENA primary key (RES_CODIGO__)
);

create table ROL (
   ROL_CODIGO__         NUMERIC(3)           not null,
   ROL_NOMBRE__         VARCHAR(30)          not null,
   ROL_DESCRIPCION__    VARCHAR(250)         not null,
   ROL_ESTADO__         VARCHAR(1)           not null,
   constraint PK_ROL primary key (ROL_CODIGO__)
);

create table UNIDAD_MEDIDA (
   UNM_CODIGO__         VARCHAR(5)           not null,
   UNM_NOMBRE__         VARCHAR(40)          not null,
   UNM_ABREVIATURA__    VARCHAR(10)          not null,
   UNM_TIPO             VARCHAR(15)          not null,
   constraint PK_UNIDAD_MEDIDA primary key (UNM_CODIGO__)
);

create table USUARIO (
   USR_CODIGO__         VARCHAR(10)          not null,
   USR_NOMBRE__         VARCHAR(100)         not null,
   USR_CORREO__         VARCHAR(150)         not null,
   USR_TELEFONO__       VARCHAR(10)          not null,
   USR_PASSWORD_HASH__  VARCHAR(255)         not null,
   USR_FECHA_REGISTRO__ DATE                 not null,
   USR_ESTADO__         VARCHAR(1)           not null
      constraint CKC_USR_ESTADO___USUARIO check (USR_ESTADO__ in ('A','I')),
   constraint PK_USUARIO primary key (USR_CODIGO__)
);

create table USUARIO_ROL (
   ROL_CODIGO__         NUMERIC(3)           not null,
   USR_CODIGO__         VARCHAR(10)          not null,
   USRL_FECHA_ASIGNACION__ DATE                 not null,
   constraint PK_USUARIO_ROL primary key (ROL_CODIGO__, USR_CODIGO__)
);

alter table CARRITO
   add constraint FK_CARRITO_USUARIO_C_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table DETALLE_CARRITO
   add constraint FK_DETALLE__CARRITO_D_CARRITO foreign key (CAR_CODIGO__)
      references CARRITO (CAR_CODIGO__)
      on delete restrict on update restrict;

alter table DETALLE_CARRITO
   add constraint FK_DETALLE__DETALLE_C_PRESENTA foreign key (PRE_CODIGO__)
      references PRESENTACION (PRE_CODIGO__)
      on delete restrict on update restrict;

alter table DETALLE_PEDIDO
   add constraint FK_DETALLE__DETALLE_P_DESCUENT foreign key (DES_CODIGO__)
      references DESCUENTO (DES_CODIGO__)
      on delete restrict on update restrict;

alter table DETALLE_PEDIDO
   add constraint FK_DETALLE__DETALLE_P_PRESENTA foreign key (PRE_CODIGO__)
      references PRESENTACION (PRE_CODIGO__)
      on delete restrict on update restrict;

alter table DETALLE_PEDIDO
   add constraint FK_DETALLE__PEDIDO_DE_PEDIDO foreign key (PED_CODIGO__)
      references PEDIDO (PED_CODIGO__)
      on delete restrict on update restrict;

alter table DIRECCION
   add constraint FK_DIRECCIO_USUARIO_D_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table ENTREGA
   add constraint FK_ENTREGA_ENTREGA_R_REPARTID foreign key (REP_CODIGO__)
      references REPARTIDOR (REP_CODIGO__)
      on delete restrict on update restrict;

alter table ENTREGA
   add constraint FK_ENTREGA_PED_TIENE_PEDIDO foreign key (PED_CODIGO__)
      references PEDIDO (PED_CODIGO__)
      on delete restrict on update restrict;

alter table EVIDENCIA_ENTREGA
   add constraint FK_EVIDENCI_HISTORIAL_HISTORIA foreign key (HIS_CODIGO__)
      references HISTORIAL_ENTREGA (HIS_CODIGO__)
      on delete restrict on update restrict;

alter table FAVORITO
   add constraint FK_FAVORITO_PRODUCTO__PRODUCTO foreign key (PRD_CODIGO__)
      references PRODUCTO (PRD_CODIGO__)
      on delete restrict on update restrict;

alter table FAVORITO
   add constraint FK_FAVORITO_USUARIO_F_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table HISTORIAL_ENTREGA
   add constraint FK_HISTORIA_ENTREGA_H_ENTREGA foreign key (ENT_CODIGO__)
      references ENTREGA (ENT_CODIGO__)
      on delete restrict on update restrict;

alter table HISTORIAL_ENTREGA
   add constraint FK_HISTORIA_HISTORIAL_ESTADO_E foreign key (EST_CODIGO__)
      references ESTADO_ENTREGA (EST_CODIGO__)
      on delete restrict on update restrict;

alter table HISTORIAL_ENTREGA
   add constraint FK_HISTORIA_USUARIO_H_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table ORDEN_COBRO
   add constraint FK_ORDEN_CO_PEDIDO_OR_PEDIDO foreign key (PED_CODIGO__)
      references PEDIDO (PED_CODIGO__)
      on delete restrict on update restrict;

alter table PAGO
   add constraint FK_PAGO_ORDEN_COB_ORDEN_CO foreign key (ORC_CODIGO__)
      references ORDEN_COBRO (ORC_CODIGO__)
      on delete restrict on update restrict;

alter table PAGO
   add constraint FK_PAGO_PAGO_METO_METODO_P foreign key (MET_CODIGO__)
      references METODO_PAGO (MET_CODIGO__)
      on delete restrict on update restrict;

alter table PEDIDO
   add constraint FK_PEDIDO_CARRITO_P_CARRITO foreign key (CAR_CODIGO__)
      references CARRITO (CAR_CODIGO__)
      on delete restrict on update restrict;

alter table PEDIDO
   add constraint FK_PEDIDO_PEDIDO_DE_DESCUENT foreign key (DES_CODIGO__)
      references DESCUENTO (DES_CODIGO__)
      on delete restrict on update restrict;

alter table PEDIDO
   add constraint FK_PEDIDO_PEDIDO_DI_DIRECCIO foreign key (DIR_CODIGO__)
      references DIRECCION (DIR_CODIGO__)
      on delete restrict on update restrict;

alter table PEDIDO
   add constraint FK_PEDIDO_USUARIO_P_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table PRESENTACION
   add constraint FK_PRESENTA_PRODUCTO__PRODUCTO foreign key (PRD_CODIGO__)
      references PRODUCTO (PRD_CODIGO__)
      on delete restrict on update restrict;

alter table PRESENTACION
   add constraint FK_PRESENTA_UNIDAD_ME_UNIDAD_M foreign key (UNM_CODIGO__)
      references UNIDAD_MEDIDA (UNM_CODIGO__)
      on delete restrict on update restrict;

alter table PRODUCTO
   add constraint FK_PRODUCTO_PRODUCTO__CATEGORI foreign key (CAT_CODIGO__)
      references CATEGORIA (CAT_CODIGO__)
      on delete restrict on update restrict;

alter table REPARTIDOR
   add constraint FK_REPARTID_USUARIO_R_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table RESENA
   add constraint FK_RESENA_PRODUCTO__PRODUCTO foreign key (PRD_CODIGO__)
      references PRODUCTO (PRD_CODIGO__)
      on delete restrict on update restrict;

alter table RESENA
   add constraint FK_RESENA_USUARIO_R_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;

alter table USUARIO_ROL
   add constraint FK_USUARIO__ROL_USUAR_ROL foreign key (ROL_CODIGO__)
      references ROL (ROL_CODIGO__)
      on delete restrict on update restrict;

alter table USUARIO_ROL
   add constraint FK_USUARIO__USUARIO_U_USUARIO foreign key (USR_CODIGO__)
      references USUARIO (USR_CODIGO__)
      on delete restrict on update restrict;