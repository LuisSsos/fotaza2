const db = require('./db');

async function enviar(id_interes, id_remitente, contenido) {
    await db.query(
        'INSERT INTO mensajes_privados (id_interes, id_remitente, contenido) VALUES ($1, $2, $3)',
        [id_interes, id_remitente, contenido]
    );
}

async function obtenerPorInteres(id_interes) {
    const resultado = await db.query(
        `SELECT m.*, u.nombre_usuario
         FROM mensajes_privados m
         JOIN usuarios u ON m.id_remitente = u.id
         WHERE m.id_interes = $1
         ORDER BY m.fecha ASC`,
        [id_interes]
    );
    return resultado.rows;
}

module.exports = { enviar, obtenerPorInteres };