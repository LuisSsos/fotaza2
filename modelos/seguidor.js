const db = require('./db');

async function seguir(id_seguidor, id_seguido) {
    const [resultado] = await db.query(
        'INSERT INTO seguidores (id_seguidor, id_seguido) VALUES (?, ?)',
        [id_seguidor, id_seguido]
    );
    return resultado.insertId;
}

async function dejarDeSeguir(id_seguidor, id_seguido) {
    await db.query(
        'DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
        [id_seguidor, id_seguido]
    );
}

async function estaSiguiendo(id_seguidor, id_seguido) {
    const [filas] = await db.query(
        'SELECT id_seguidor FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
        [id_seguidor, id_seguido]
    );
    return filas.length > 0;
}

async function contarSeguidores(id_usuario) {
    const [filas] = await db.query(
        'SELECT COUNT(*) as total FROM seguidores WHERE id_seguido = ?',
        [id_usuario]
    );
    return filas[0].total;
}

async function contarSeguidos(id_usuario) {
    const [filas] = await db.query(
        'SELECT COUNT(*) as total FROM seguidores WHERE id_seguidor = ?',
        [id_usuario]
    );
    return filas[0].total;
}

module.exports = { seguir, dejarDeSeguir, estaSiguiendo, contarSeguidores, contarSeguidos };