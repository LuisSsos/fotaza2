# Fotaza 2

Pagina web tipo red social inspirada en half life para compartir fotos. Podes subir publicaciones con imagenes, comentar, valorar del 1 al 5, seguir usuarios, guardar en colecciones y recibir notificaciones.

Hecha con Node.js, Express, Pug y PostgreSQL. Las imagenes subidas se guardaran en Cloudinary.

## Requisitos

- Node.js
- PostgreSQL

## Instalacion

1- Clonar el repositorio

2- Ejecutar npm install

3- Crear el usuario y la base en PostgreSQL (en Linux):

```
sudo -u postgres psql -c "CREATE USER fotaza WITH PASSWORD 'fotaza_local';"
sudo -u postgres psql -c "CREATE DATABASE fotaza2 OWNER fotaza;"
```

4- Crear el archivo .env a partir de .env.example (ver "Variables de entorno")

5- Cargar la direccion de la base en la terminal (los scripts db:init y db:seed usan psql, y npm no lee el .env para eso):

```
export DATABASE_URL=postgresql://fotaza:fotaza_local@localhost:5432/fotaza2
```

6- Ejecutar npm run db:init

7- Ejecutar npm run db:seed (ejecutar db:init y db:seed una sola vez, si no se duplican los datos)

8- Ejecutar npm start

La app queda disponible en http://localhost:3000

## Variables de entorno

Crear un archivo .env basado en .env.example y completar:

- PORT: puerto donde corre la app (3000)
- SESSION_SECRET: un texto largo y secreto cualquiera, para las sesiones
- DATABASE_URL: direccion de la base, por ejemplo postgresql://fotaza:fotaza_local@localhost:5432/fotaza2
- DB_SSL: poner false si se usa una PostgreSQL instalada en la compu; si no se pone, usa conexion segura (lo que pide Render)
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: datos de la cuenta de Cloudinary donde se guardan las imagenes (para subir imagenes hace falta una cuenta)

## Usuarios de prueba

- admin / admin@fotaza2.com / contraseña: admin1234 / rol: admin
- validador / validador@fotaza2.com / contraseña: validador1234 / rol: validador
- usuario_prueba / usuario@fotaza2.com / contraseña: usuario1234 / rol: comun

## Endpoints

Todas las rutas, salvo las de login, registro y la home, piden estar logueado.

| Metodo | Ruta | Que hace |
|---|---|---|
| GET | / | Home. Sin login muestra solo contenido sin copyright |
| GET | /buscar | Buscador (palabra, etiqueta, licencia) |
| GET | /perfil | Mi perfil |
| GET | /siguiendo | Publicaciones de los usuarios que sigo |
| GET | /notificaciones | Mis notificaciones |
| POST | /notificaciones/:id/leida | Marcar una notificacion como leida |
| GET, POST | /auth/registro | Registrarse |
| GET, POST | /auth/login | Iniciar sesion |
| GET | /auth/logout | Cerrar sesion |
| GET, POST | /publicaciones/nueva | Crear una publicacion con imagenes, etiquetas y licencia |
| GET | /publicaciones/:id | Ver una publicacion |
| POST | /publicaciones/:id/comentar | Comentar |
| POST | /publicaciones/:id/imagen/:id_imagen/valorar | Valorar una imagen (1 a 5) |
| POST | /publicaciones/:id/comentarios/toggle | Abrir o cerrar los comentarios (autor) |
| POST | /publicaciones/:id/comentarios/:id_comentario/eliminar | Borrar un comentario denunciado (autor) |
| POST | /publicaciones/:id/eliminar | Eliminar la publicacion (autor, si no tiene denuncias) |
| GET | /usuarios/:id | Perfil de otro usuario |
| POST | /usuarios/:id/seguir | Seguir o dejar de seguir |
| GET, POST | /denuncias/imagen/:id_imagen | Denunciar una imagen |
| GET, POST | /denuncias/comentario/:id_comentario | Denunciar un comentario |
| GET | /denuncias/validador | Panel del validador (validador y admin) |
| POST | /denuncias/validador/:id_publicacion/bajar | Dar de baja una publicacion (validador) |
| POST | /denuncias/validador/:id_publicacion/desestimar | Desestimar las denuncias (validador) |
| POST | /intereses/imagen/:id_imagen | Me interesa |
| GET | /intereses/conversaciones | Mis conversaciones |
| GET, POST | /intereses/chat/:id_interes | Ver y enviar mensajes |
| GET | /colecciones | Mis colecciones |
| POST | /colecciones/nueva | Crear una coleccion |
| GET, POST | /colecciones/seleccionar | Elegir una coleccion y guardar una publicacion |
| POST | /colecciones/favorito | Guardar una publicacion en Favoritos |
| GET | /colecciones/:id | Ver una coleccion |
| POST | /colecciones/:id/agregar | Agregar una publicacion a una coleccion |
| POST | /colecciones/:id/eliminar | Eliminar una coleccion |

## Problemas encontrados

- Las sesiones no se guardaban entre redirecciones, se soluciono con req.session.save()
- Intente usar Railway como nube para mi pagina web, cambie a render que no es de pago
- Migre a PostgreSQL para poder usar Render ya que no soportaba MySQL
- Estaba guardando las imagenes en el disco, tuve que migrar a Cloudinary
-habia subido al repositorio el .env y no me habia dado cuenta// tuve que cambiar todas las contraseñas: cloudinary,render,database, etc
-cada que el usuario publicaba algo sin imagenes o titulo no se podia eliminar,denunciar, etc (bug) // lo solucione verificando que lluguen archivos antes de crear la publicación, Si no hay ninguna imagen, no crea nada y muestra el error al usuario^