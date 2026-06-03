const db = require('./db');

async function crear(datos) {
    await db.query(
        'INSERT INTO notificaciones (id_destinatario, id_actor, tipo, id_publicacion) VALUES ($1, $2, $3, $4)',
        [datos.id_destinatario, datos.id_actor, datos.tipo, datos.id_publicacion]
    );
}

async function obtenerPorUsuario(id_usuario) {
    const resultado = await db.query(
        `SELECT n.*, u.nombre_usuario as actor
         FROM notificaciones n
         JOIN usuarios u ON n.id_actor = u.id
         WHERE n.id_destinatario = $1
         ORDER BY n.fecha DESC`,
        [id_usuario]
    );
    return resultado.rows;
}

async function marcarLeida(id, id_usuario) {
    await db.query(
        'UPDATE notificaciones SET leida = true WHERE id = $1 AND id_destinatario = $2',
        [id, id_usuario]
    );
}

async function contarNoLeidas(id_usuario) {
    const resultado = await db.query(
        'SELECT COUNT(*) as total FROM notificaciones WHERE id_destinatario = $1 AND leida = false',
        [id_usuario]
    );
    return parseInt(resultado.rows[0].total);
}

module.exports = { crear, obtenerPorUsuario, marcarLeida, contarNoLeidas };