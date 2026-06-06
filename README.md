# Fotaza 2

pagina web tipo red social para compartir fotos. Podes subir publicaciones con imagenes, comentar, valorar con estrellas y recibir notificaciones cuando alguien interactua con tu contenido.

Hecha con Node.js, Express, Pug y MySQL.

## Requisitos

- Node.js
- MySQL

## Instalacion

1- Clonar el repositorio
2- Ejecutar 'npm install'
3- Configurar el archivo '.env' con los datos de la base de datos (ver '.env.example')
4- Ejecutar 'npm run db:init'
5- Ejecutar 'npm start'
6- Ejecutar 'npm run db:seed'

La app queda disponible en `http://localhost:3000`

## Variables de entorno

Crear un archivo `.env` basado en `.env.example`:

## Usuarios de prueba

- hola / hola123@gmail.com / contraseña: hola / rol: comun
- toto / toto123@gmail.com / contraseña: toto / rol: comun
- validador/ validador@fotaza2.com / contraseña: validador1234 / rol: validador

## Problemas encontrandos
- Las sesiones no se guardaban entre redirecciones, se soluciono con req.session.save()
- MySQL tiraba errores de incompatabilidad en las claves foraneas al recrear las tablas
- Intente usar Railway como nube para mi pagina web, era de pago
- Migre a postgreSQL para poder usar Render ya que no tomaba SQL
- Estaba guardando las imagenes en el disco sin saber que deberia subirlo a una nube jajaja