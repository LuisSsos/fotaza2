const db = require('./db');

async function registrar(id_imagen, id_usuario) {
    const resultado = await db.query(
        'INSERT INTO intereses (id_imagen, id_usuario) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
        [id_imagen, id_usuario]
    );
    return resultado.rows[0];
}

async function obtenerPorImagen(id_imagen) {
    const resultado = await db.query(
        `SELECT i.*, u.nombre_usuario, u.foto_perfil
         FROM intereses i
         JOIN usuarios u ON i.id_usuario = u.id
         WHERE i.id_imagen = $1`,
        [id_imagen]
    );
    return resultado.rows;
}

async function obtenerConversaciones(id_usuario) {
    const resultado = await db.query(
        `SELECT i.*, u.nombre_usuario as interesado, img.nombre_archivo, p.titulo, p.id_autor
         FROM intereses i
         JOIN usuarios u ON i.id_usuario = u.id
         JOIN imagenes img ON i.id_imagen = img.id
         JOIN publicaciones p ON img.id_publicacion = p.id
         WHERE i.id_usuario = $1 OR p.id_autor = $1
         ORDER BY i.fecha DESC`,
        [id_usuario]
    );
    return resultado.rows;
}

async function obtenerPorId(id) {
    const resultado = await db.query(
        `SELECT i.*, p.id_autor
         FROM intereses i
         JOIN imagenes img ON i.id_imagen = img.id
         JOIN publicaciones p ON img.id_publicacion = p.id
         WHERE i.id = $1`,
        [id]
    );
    return resultado.rows[0];
}

module.exports = { registrar, obtenerPorImagen, obtenerConversaciones, obtenerPorId };