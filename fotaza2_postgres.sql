CREATE TABLE IF NOT EXISTS usuarios (
    id             SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(40)  NOT NULL UNIQUE,
    correo         VARCHAR(120) NOT NULL UNIQUE,
    contrasena     VARCHAR(255) NOT NULL,
    nombre_real    VARCHAR(80)  NULL,
    biografia      TEXT         NULL,
    foto_perfil    VARCHAR(255) NULL,
    rol            VARCHAR(20)  NOT NULL DEFAULT 'comun' CHECK (rol IN ('comun','validador','admin')),
    activo         BOOLEAN      NOT NULL DEFAULT TRUE,
    pub_bajadas    SMALLINT     NOT NULL DEFAULT 0 CHECK (pub_bajadas <= 3),
    fecha_registro TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS etiquetas (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS motivos_denuncia (
    id          SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS publicaciones (
    id                   SERIAL PRIMARY KEY,
    id_autor             INTEGER      NOT NULL REFERENCES usuarios(id),
    titulo               VARCHAR(120) NOT NULL,
    descripcion          TEXT         NULL,
    estado               VARCHAR(20)  NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa','en_revision','baja')),
    comentarios_abiertos BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_publicacion    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS imagenes (
    id             SERIAL PRIMARY KEY,
    id_publicacion INTEGER      NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    licencia       VARCHAR(20)  NOT NULL DEFAULT 'libre' CHECK (licencia IN ('libre','copyright')),
    marca_agua     VARCHAR(120) NULL
);

CREATE TABLE IF NOT EXISTS publicaciones_etiquetas (
    id_publicacion INTEGER NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    id_etiqueta    INTEGER NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (id_publicacion, id_etiqueta)
);

CREATE TABLE IF NOT EXISTS comentarios (
    id             SERIAL PRIMARY KEY,
    id_publicacion INTEGER   NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    id_autor       INTEGER   NOT NULL REFERENCES usuarios(id),
    contenido      TEXT      NOT NULL,
    eliminado      BOOLEAN   NOT NULL DEFAULT FALSE,
    fecha          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS denuncias_imagenes (
    id            SERIAL PRIMARY KEY,
    id_imagen     INTEGER NOT NULL REFERENCES imagenes(id) ON DELETE CASCADE,
    id_usuario    INTEGER NOT NULL REFERENCES usuarios(id),
    id_motivo     INTEGER NOT NULL REFERENCES motivos_denuncia(id),
    justificacion TEXT    NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_imagen, id_usuario)
);

CREATE TABLE IF NOT EXISTS denuncias_comentarios (
    id            SERIAL PRIMARY KEY,
    id_comentario INTEGER NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    id_usuario    INTEGER NOT NULL REFERENCES usuarios(id),
    id_motivo     INTEGER NOT NULL REFERENCES motivos_denuncia(id),
    justificacion TEXT    NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_comentario, id_usuario)
);

CREATE TABLE IF NOT EXISTS valoraciones (
    id         SERIAL PRIMARY KEY,
    id_imagen  INTEGER  NOT NULL REFERENCES imagenes(id) ON DELETE CASCADE,
    id_usuario INTEGER  NOT NULL REFERENCES usuarios(id),
    valor      SMALLINT NOT NULL CHECK (valor BETWEEN 1 AND 5),
    fecha      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_imagen, id_usuario)
);

CREATE TABLE IF NOT EXISTS intereses (
    id         SERIAL PRIMARY KEY,
    id_imagen  INTEGER   NOT NULL REFERENCES imagenes(id) ON DELETE CASCADE,
    id_usuario INTEGER   NOT NULL REFERENCES usuarios(id),
    fecha      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_imagen, id_usuario)
);

CREATE TABLE IF NOT EXISTS mensajes_privados (
    id           SERIAL PRIMARY KEY,
    id_interes   INTEGER   NOT NULL REFERENCES intereses(id) ON DELETE CASCADE,
    id_remitente INTEGER   NOT NULL REFERENCES usuarios(id),
    contenido    TEXT      NOT NULL,
    leido        BOOLEAN   NOT NULL DEFAULT FALSE,
    fecha        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seguidores (
    id_seguidor INTEGER   NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    id_seguido  INTEGER   NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_seguidor, id_seguido),
    CHECK (id_seguidor <> id_seguido)
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id              SERIAL PRIMARY KEY,
    id_destinatario INTEGER   NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    id_actor        INTEGER   NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('comentario','valoracion','interes','nuevo_seguidor')),
    id_publicacion  INTEGER   NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    leida           BOOLEAN   NOT NULL DEFAULT FALSE,
    fecha           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS colecciones (
    id         SERIAL PRIMARY KEY,
    id_usuario INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre     VARCHAR(80)  NOT NULL,
    fecha      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS colecciones_publicaciones (
    id_coleccion   INTEGER   NOT NULL REFERENCES colecciones(id) ON DELETE CASCADE,
    id_publicacion INTEGER   NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    fecha          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_coleccion, id_publicacion)
);

INSERT INTO motivos_denuncia (descripcion) VALUES
    ('Contenido inapropiado'),
    ('Violacion de derechos de autor'),
    ('Acoso u ofensas'),
    ('Spam'),
    ('Otro');
