const db = require('./db');

async function obtenerTodas() {
    const resultado = await db.query('SELECT * FROM etiquetas ORDER BY nombre ASC');
    return resultado.rows;
}

async function buscarOCrear(nombre) {
    const nombreLimpio = nombre.trim().toLowerCase();
    await db.query(
        'INSERT INTO etiquetas (nombre) VALUES ($1) ON CONFLICT DO NOTHING',
        [nombreLimpio]
    );
    const resultado = await db.query('SELECT * FROM etiquetas WHERE nombre = $1', [nombreLimpio]);
    return resultado.rows[0];
}

module.exports = { obtenerTodas, buscarOCrear };