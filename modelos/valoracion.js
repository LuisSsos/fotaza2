const db = require('./db');

async function valorar(datos) {
    const [resultado] = await db.query(
        'INSERT INTO valoraciones (id_imagen,id_usuario,valor) VALUES (?,?,?)',
        [datos.id_imagen, datos.id_usuario,datos.valor]
    );
    return resultado.insertId
}

async function obtenerPromedio(id_imagen) {
    const [filas] = await db.query(
        'SELECT AVG(valor) as promedio, COUNT(*) as total FROM valoraciones WHERE id_imagen = ?',
        [id_imagen]
    );
return filas[0]
}

async function yaValoro(id_imagen,id_usuario) {
    const [filas] = await db.query(
        'SELECT id FROM valoraciones WHERE id_imagen = ?, AND id_usuario = ?',
        [id_imagen, id_usuario]
    );
    return filas.length>0;

}

module.exports = { valorar, obtenerPromedio, yaValoro   }