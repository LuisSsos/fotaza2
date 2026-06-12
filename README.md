# Fotaza 2

Pagina web tipo red social inspirada en half life para compartir fotos. Podes subir publicaciones con imagenes, comentar, valorar con estrellas, seguir usuarios, guardar en colecciones y recibir notificaciones.

Hecha con Node.js, Express, Pug y PostgreSQL. Las imagenes subidas se guardaran en Cloudinary.

## Requisitos

- Node.js
- PostgreSQL

## Instalacion

1- Clonar el repositorio
2- Ejecutar npm install
3- Configurar el archivo .env con los datos de la base de datos (ver .env.example)
4- Ejecutar npm run db:init
5- Ejecutar npm run db:seed
6- Ejecutar npm start

La app queda disponible en http://localhost:3000

## Variables de entorno

Crear un archivo .env basado en .env.example

## Usuarios de prueba

- admin / admin@fotaza2.com / contraseña: admin1234 / rol: admin
- validador / validador@fotaza2.com / contraseña: validador1234 / rol: validador
- hola / hola123@gmail.com / contraseña: hola / rol: comun
- toto / toto123@gmail.com / contraseña: toto / rol: comun

## Problemas encontrados

- Las sesiones no se guardaban entre redirecciones, se soluciono con req.session.save()
- Intente usar Railway como nube para mi pagina web, cambie a render que no es de pago
- Migre a PostgreSQL para poder usar Render ya que no soportaba MySQL
- Estaba guardando las imagenes en el disco, tuve que migrar a Cloudinary
-habia subido al repositorio el .env y no me habia dado cuenta// tuve que cambiar todas las contraseñas: cloudinary,render,database, etc
-cada que el usuario publicaba algo sin imagenes o titulo no se podia eliminar,denunciar, etc (bug) // lo solucione verificando que lluguen archivos antes de crear la publicación, Si no hay ninguna imagen, no crea nada y muestra el error al usuario^