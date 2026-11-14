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

async function denunciarComentario(datos) {
    await db.query(
        'INSERT INTO denuncias_comentarios (id_comentario, id_usuario, id_motivo, justificacion) VALUES ($1, $2, $3, $4)',
        [datos.id_comentario, datos.id_usuario, datos.id_motivo, datos.justificacion]
    );
}

async function obtenerDenunciasComentarios(id_publicacion) {
    const resultado = await db.query(
        `SELECT dc.*, c.contenido, uc.nombre_usuario AS autor_comentario,
                ud.nombre_usuario AS denunciante, m.descripcion AS motivo
         FROM denuncias_comentarios dc
         JOIN comentarios c ON dc.id_comentario = c.id
         JOIN usuarios uc ON c.id_autor = uc.id
         JOIN usuarios ud ON dc.id_usuario = ud.id
         JOIN motivos_denuncia m ON dc.id_motivo = m.id
         WHERE c.id_publicacion = $1 AND c.eliminado = false
         ORDER BY dc.fecha DESC`,
        [id_publicacion]
    );
    return resultado.rows;
}

module.exports = { denunciarImagen, contarDenunciasImagen, obtenerDenunciasPublicacion, obtenerPublicacionesEnRevision, obtenerMotivos, denunciarComentario, obtenerDenunciasComentarios };