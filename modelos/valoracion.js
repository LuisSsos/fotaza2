const db = require('./db');

async function valorar(datos) {
    const resultado = await db.query(
        'INSERT INTO valoraciones (id_imagen, id_usuario, valor) VALUES ($1, $2, $3) RETURNING id',
        [datos.id_imagen, datos.id_usuario, datos.valor]
    );
    return resultado.rows[0].id;
}

async function obtenerPromedio(id_imagen) {
    const resultado = await db.query(
        'SELECT AVG(valor) as promedio, COUNT(*) as total FROM valoraciones WHERE id_imagen = $1',
        [id_imagen]
    );
    return resultado.rows[0];
}

async function yaValoro(id_imagen, id_usuario) {
    const resultado = await db.query(
        'SELECT id FROM valoraciones WHERE id_imagen = $1 AND id_usuario = $2',
        [id_imagen, id_usuario]
    );
    return resultado.rows.length > 0;
}

module.exports = { valorar, obtenerPromedio, yaValoro };