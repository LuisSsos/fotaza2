const db = require('./db');

async function crear(datos) {
    const resultado = await db.query(
        'INSERT INTO comentarios (id_publicacion, id_autor, contenido) VALUES ($1, $2, $3) RETURNING id',
        [datos.id_publicacion, datos.id_autor, datos.contenido]
    );
    return resultado.rows[0].id;
}

async function obtenerPorPublicacion(id_publicacion) {
    const resultado = await db.query(
        `SELECT c.*, u.nombre_usuario 
         FROM comentarios c 
         JOIN usuarios u ON c.id_autor = u.id 
         WHERE c.id_publicacion = $1 AND c.eliminado = false
         ORDER BY c.fecha ASC`,
        [id_publicacion]
    );
    return resultado.rows;
}

module.exports = { crear, obtenerPorPublicacion };