const db = require('./db');

async function crear(id_usuario, nombre) {
    const resultado = await db.query(
        'INSERT INTO colecciones (id_usuario, nombre) VALUES ($1, $2) RETURNING id',
        [id_usuario, nombre]
    );
    return resultado.rows[0].id;
}

async function obtenerPorUsuario(id_usuario) {
    const resultado = await db.query(
        'SELECT * FROM colecciones WHERE id_usuario = $1 ORDER BY fecha DESC',
        [id_usuario]
    );
    return resultado.rows;
}

async function agregarPublicacion(id_coleccion, id_publicacion) {
    await db.query(
        'INSERT INTO colecciones_publicaciones (id_coleccion, id_publicacion) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id_coleccion, id_publicacion]
    );
}

async function obtenerPublicaciones(id_coleccion) {
    const resultado = await db.query(
        `SELECT p.*, u.nombre_usuario
         FROM publicaciones p
         JOIN colecciones_publicaciones cp ON p.id = cp.id_publicacion
         JOIN usuarios u ON p.id_autor = u.id
         WHERE cp.id_coleccion = $1`,
        [id_coleccion]
    );
    return resultado.rows;
}

async function obtenerPorId(id) {
    const resultado = await db.query('SELECT * FROM colecciones WHERE id = $1', [id]);
    return resultado.rows[0];
}

async function eliminar(id) {
    await db.query('DELETE FROM colecciones WHERE id = $1', [id]);
}

module.exports = { crear, obtenerPorUsuario, agregarPublicacion, obtenerPublicaciones, obtenerPorId , eliminar};