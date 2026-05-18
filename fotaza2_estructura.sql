SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS usuarios (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_usuario VARCHAR(40)  NOT NULL,
    correo         VARCHAR(120) NOT NULL,
    contrasena     VARCHAR(255) NOT NULL,
    nombre_real    VARCHAR(80)  NULL,
    biografia      TEXT         NULL,
    foto_perfil    VARCHAR(255) NULL,
    rol            ENUM('comun','validador','admin') NOT NULL DEFAULT 'comun',
    activo         TINYINT(1)   NOT NULL DEFAULT 1,
    pub_bajadas    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    fecha_registro DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_nombre_usuario (nombre_usuario),
    UNIQUE KEY uq_correo (correo),
    CONSTRAINT chk_pub_bajadas CHECK (pub_bajadas <= 3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS etiquetas (
    id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60)  NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_etiqueta (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS motivos_denuncia (
    id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(100)     NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS publicaciones (
    id                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_autor             INT UNSIGNED NOT NULL,
    titulo               VARCHAR(120) NOT NULL,
    descripcion          TEXT         NULL,
    estado               ENUM('activa','en_revision','baja') NOT NULL DEFAULT 'activa',
    comentarios_abiertos TINYINT(1)   NOT NULL DEFAULT 1,
    fecha_publicacion    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_autor (id_autor),
    CONSTRAINT fk_pub_autor FOREIGN KEY (id_autor) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS imagenes (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_publicacion INT UNSIGNED NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    licencia       ENUM('libre','copyright') NOT NULL DEFAULT 'libre',
    marca_agua     VARCHAR(120) NULL,

    PRIMARY KEY (id),
    KEY idx_img_pub (id_publicacion),
    CONSTRAINT fk_img_pub FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS publicaciones_etiquetas (
    id_publicacion INT UNSIGNED NOT NULL,
    id_etiqueta    INT UNSIGNED NOT NULL,

    PRIMARY KEY (id_publicacion, id_etiqueta),
    CONSTRAINT fk_pe_pub  FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id) ON DELETE CASCADE,
    CONSTRAINT fk_pe_etiq FOREIGN KEY (id_etiqueta)    REFERENCES etiquetas (id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS comentarios (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_publicacion INT UNSIGNED NOT NULL,
    id_autor       INT UNSIGNED NOT NULL,
    contenido      TEXT         NOT NULL,
    eliminado      TINYINT(1)   NOT NULL DEFAULT 0,
    fecha          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_com_pub (id_publicacion),
    CONSTRAINT fk_com_pub   FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id) ON DELETE CASCADE,
    CONSTRAINT fk_com_autor FOREIGN KEY (id_autor)       REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS denuncias_imagenes (
    id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_imagen     INT UNSIGNED     NOT NULL,
    id_usuario    INT UNSIGNED     NOT NULL,
    id_motivo     TINYINT UNSIGNED NOT NULL,
    justificacion TEXT             NOT NULL,
    fecha         DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_denuncia_img (id_imagen, id_usuario),
    CONSTRAINT fk_di_imagen  FOREIGN KEY (id_imagen)  REFERENCES imagenes (id)        ON DELETE CASCADE,
    CONSTRAINT fk_di_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    CONSTRAINT fk_di_motivo  FOREIGN KEY (id_motivo)  REFERENCES motivos_denuncia (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS denuncias_comentarios (
    id            INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_comentario INT UNSIGNED     NOT NULL,
    id_usuario    INT UNSIGNED     NOT NULL,
    id_motivo     TINYINT UNSIGNED NOT NULL,
    justificacion TEXT             NOT NULL,
    fecha         DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_denuncia_com (id_comentario, id_usuario),
    CONSTRAINT fk_dc_com     FOREIGN KEY (id_comentario) REFERENCES comentarios (id)   ON DELETE CASCADE,
    CONSTRAINT fk_dc_usuario FOREIGN KEY (id_usuario)    REFERENCES usuarios (id),
    CONSTRAINT fk_dc_motivo  FOREIGN KEY (id_motivo)     REFERENCES motivos_denuncia (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS valoraciones (
    id         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_imagen  INT UNSIGNED     NOT NULL,
    id_usuario INT UNSIGNED     NOT NULL,
    valor      TINYINT UNSIGNED NOT NULL,
    fecha      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_valoracion (id_imagen, id_usuario),
    CONSTRAINT chk_valor  CHECK (valor BETWEEN 1 AND 5),
    CONSTRAINT fk_val_img FOREIGN KEY (id_imagen)  REFERENCES imagenes (id) ON DELETE CASCADE,
    CONSTRAINT fk_val_usu FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS intereses (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_imagen  INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    fecha      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_interes (id_imagen, id_usuario),
    CONSTRAINT fk_int_img FOREIGN KEY (id_imagen)  REFERENCES imagenes (id) ON DELETE CASCADE,
    CONSTRAINT fk_int_usu FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS mensajes_privados (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_interes   INT UNSIGNED NOT NULL,
    id_remitente INT UNSIGNED NOT NULL,
    contenido    TEXT         NOT NULL,
    leido        TINYINT(1)   NOT NULL DEFAULT 0,
    fecha        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_msg_interes (id_interes),
    CONSTRAINT fk_msg_int FOREIGN KEY (id_interes)   REFERENCES intereses (id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_rem FOREIGN KEY (id_remitente) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS seguidores (
    id_seguidor INT UNSIGNED NOT NULL,
    id_seguido  INT UNSIGNED NOT NULL,
    fecha       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_seguidor, id_seguido),
    CONSTRAINT chk_no_autofollow   CHECK (id_seguidor <> id_seguido),
    CONSTRAINT fk_seg_seguidor FOREIGN KEY (id_seguidor) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_seg_seguido  FOREIGN KEY (id_seguido)  REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS notificaciones (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_destinatario INT UNSIGNED NOT NULL,
    id_actor        INT UNSIGNED NOT NULL,
    tipo            ENUM('comentario','valoracion','interes','nuevo_seguidor') NOT NULL,
    id_publicacion  INT UNSIGNED NULL,
    leida           TINYINT(1)   NOT NULL DEFAULT 0,
    fecha           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_notif_dest (id_destinatario),
    CONSTRAINT fk_notif_dest  FOREIGN KEY (id_destinatario) REFERENCES usuarios (id)      ON DELETE CASCADE,
    CONSTRAINT fk_notif_actor FOREIGN KEY (id_actor)        REFERENCES usuarios (id)      ON DELETE CASCADE,
    CONSTRAINT fk_notif_pub   FOREIGN KEY (id_publicacion)  REFERENCES publicaciones (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS colecciones (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    nombre     VARCHAR(80)  NOT NULL,
    fecha      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_col_usu (id_usuario),
    CONSTRAINT fk_col_usu FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS colecciones_publicaciones (
    id_coleccion   INT UNSIGNED NOT NULL,
    id_publicacion INT UNSIGNED NOT NULL,
    fecha          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_coleccion, id_publicacion),
    CONSTRAINT fk_cp_col FOREIGN KEY (id_coleccion)   REFERENCES colecciones (id)   ON DELETE CASCADE,
    CONSTRAINT fk_cp_pub FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO motivos_denuncia (descripcion) VALUES
    ('Contenido inapropiado'),
    ('Violacion de derechos de autor'),
    ('Acoso u ofensas'),
    ('Spam'),
    ('Otro');