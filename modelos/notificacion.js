const db = require('./db');

async function crear(datos){
await db.query(
    'INSERT INTO notificaciones (id_destinatario,id_actor,tipo,id_publicacion) VALUEs (?,?,?,?)',
    [datos.id_destinatario,datos.id_actor,datos.tipo,datos.id_publicacion]
);
}

async function obtenerPorUsuario(id_usuario){
    const [filas] = await db.query(
        `SELECT n.*, u.nombre_usuario as actor
         FROM notificaciones n
         JOIN usuarios u ON n.id_actor = u.id
         WHERE n.id_destinatario = ?
         ORDER BY n.fecha DESC`,
        [id_usuario]
    );
    return filas;
}
async function marcarLeida(id, id_usuario) {
    await db.query(
        'UPDATE notificaciones SET leida = 1 WHERE id = ? AND id_destinatario = ?',
        [id, id_usuario]
    );
}

async function contarNoLeidas(id_usuario) {
    const [filas] = await db.query(
        'SELECT COUNT(*) as total FROM notificaciones WHERE id_destinatario = ? AND leida = 0',
        [id_usuario]
    );
    return filas[0].total;
}

module.exports = { crear, obtenerPorUsuario, marcarLeida, contarNoLeidas };