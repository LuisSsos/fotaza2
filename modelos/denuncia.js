const db = require('./db');

async function denunciarImagen(datos) {
    await db.query(
        'INSERT INTO denuncias_imagenes (id_imagen, id_usuario, id_motivo, justificacion) VALUES ($1, $2, $3, $4)',
        [datos.id_imagen, datos.id_usuario, datos.id_motivo, datos.justificacion]
    );
}

async function contarDenunciasImagen(id_imagen) {
    const resultado = await db.query(
        'SELECT COUNT(*) as total FROM denuncias_imagenes WHERE id_imagen = $1',
        [id_imagen]
    );
    return parseInt(resultado.rows[0].total);
}

async function obtenerDenunciasPublicacion(id_publicacion) {
    const resultado = await db.query(
        `SELECT di.*, u.nombre_usuario, m.descripcion as motivo
         FROM denuncias_imagenes di
         JOIN usuarios u ON di.id_usuario = u.id
         JOIN motivos_denuncia m ON di.id_motivo = m.id
         JOIN imagenes i ON di.id_imagen = i.id
         WHERE i.id_publicacion = $1`,
        [id_publicacion]
    );
    return resultado.rows;
}

async function obtenerPublicacionesEnRevision() {
    const resultado = await db.query(
        `SELECT p.*, u.nombre_usuario
         FROM publicaciones p
         JOIN usuarios u ON p.id_autor = u.id
         WHERE p.estado = 'en_revision'
         ORDER BY p.fecha_publicacion DESC`
    );
    return resultado.rows;
}

async function obtenerMotivos() {
    const resultado = await db.query('SELECT * FROM motivos_denuncia');
    return resultado.rows;
}

module.exports = { denunciarImagen, contarDenunciasImagen, obtenerDenunciasPublicacion, obtenerPublicacionesEnRevision, obtenerMotivos };