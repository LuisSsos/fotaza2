const db = require('./db');

async function buscarPorCorreo(correo) {
    const resultado = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return resultado.rows[0]; 
}

async function buscarPorId(id) {
    const resultado = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return resultado.rows[0];
}

async function crear(datos) {
    const resultado = await db.query(
        'INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES ($1, $2, $3) RETURNING id',
        [datos.nombre_usuario, datos.correo, datos.contrasena]
    );
    return resultado.rows[0].id;
}
async function actualizarFotoPerfil(id, url) {
    await db.query(
        'UPDATE usuarios SET foto_perfil = $1 WHERE id = $2',
        [url, id]
    );
}

module.exports = { buscarPorCorreo, buscarPorId, crear, actualizarFotoPerfil};