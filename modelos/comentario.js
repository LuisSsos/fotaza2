const db = require('./db');

async function crear(datos) {
    const [resultado] = await db.query(
        'INSERT INTO comentarios (id_publicacion, id_autor,contenido) VALUES (?,?,?)',
        [datos.id_publicacion,datos.id_autor,datos.contenido]
    );
    return resultado.insertId;
}

async function obtenerPorPublicacion(id_publicacion) {
    const [filas] = await db.query(
        `SELECT c.*, u.nombre_usuario 
         FROM comentarios c 
         JOIN usuarios u ON c.id_autor = u.id 
         WHERE c.id_publicacion = ? AND c.eliminado = 0
         ORDER BY c.fecha ASC`,
        [id_publicacion]
    );
    return filas;
}

module.exports = { crear, obtenerPorPublicacion};