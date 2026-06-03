const db = require('./db');

async function seguir(id_seguidor, id_seguido) {
    await db.query(
        'INSERT INTO seguidores (id_seguidor, id_seguido) VALUES ($1, $2)',
        [id_seguidor, id_seguido]
    );
}

async function dejarDeSeguir(id_seguidor, id_seguido) {
    await db.query(
        'DELETE FROM seguidores WHERE id_seguidor = $1 AND id_seguido = $2',
        [id_seguidor, id_seguido]
    );
}

async function estaSiguiendo(id_seguidor, id_seguido) {
    const resultado = await db.query(
        'SELECT id_seguidor FROM seguidores WHERE id_seguidor = $1 AND id_seguido = $2',
        [id_seguidor, id_seguido]
    );
    return resultado.rows.length > 0;
}

async function contarSeguidores(id_usuario) {
    const resultado = await db.query(
        'SELECT COUNT(*) as total FROM seguidores WHERE id_seguido = $1',
        [id_usuario]
    );
    return parseInt(resultado.rows[0].total);
}

async function contarSeguidos(id_usuario) {
    const resultado = await db.query(
        'SELECT COUNT(*) as total FROM seguidores WHERE id_seguidor = $1',
        [id_usuario]
    );
    return parseInt(resultado.rows[0].total);
}

module.exports = { seguir, dejarDeSeguir, estaSiguiendo, contarSeguidores, contarSeguidos };