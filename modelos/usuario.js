const db = require('./db');

async function buscarPorCorreo(correo) {
    const [filas] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0]; 
}

async function buscarPorId(id){
    const [filas] = await db.query('SELECT * FROM usuarios Where id = ?', [id]);
    return filas [0];
}

async function crear (datos){
    const [resuelto] = await db.query (
        'INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?,?,?)',
        [datos.nombre_usuario,datos.correo,datos.contrasena]
    );
    return resuelto.insertId;
}

module.exports  = { buscarPorCorreo, buscarPorId, crear};