const db = require('./db');

async function crear(datos) {
    const resultado = await db.query(
        'INSERT INTO publicaciones (id_autor, titulo, descripcion) VALUES ($1, $2, $3) RETURNING id',
        [datos.id_autor, datos.titulo, datos.descripcion]
    );
    return resultado.rows[0].id;
}

async function obtenerTodas(soloPublicas = false) {
    let query = `SELECT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.estado = 'activa'`;
    
    if (soloPublicas) {
        query += ` AND EXISTS (
            SELECT 1 FROM imagenes i 
            WHERE i.id_publicacion = p.id 
            AND i.licencia = 'libre'
        )`;
    }
    
    query += ` ORDER BY p.fecha_publicacion DESC`;
    
    const resultado = await db.query(query);
    return resultado.rows;
}

async function obtenerPorId(id) {
    const resultado = await db.query(
        `SELECT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.id = $1`,
        [id]
    );
    return resultado.rows[0];
}

async function agregarImagen(datos) {
    const resultado = await db.query(
        'INSERT INTO imagenes (id_publicacion, nombre_archivo, licencia) VALUES ($1, $2, $3) RETURNING id',
        [datos.id_publicacion, datos.nombre_archivo, datos.licencia]
    );
    return resultado.rows[0].id;
}

async function obtenerImagenes(id_publicacion) {
    const resultado = await db.query(
        'SELECT * FROM imagenes WHERE id_publicacion = $1',
        [id_publicacion]
    );
    return resultado.rows;
}

async function buscar(termino) {
    const resultado = await db.query(
        `SELECT DISTINCT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         LEFT JOIN publicaciones_etiquetas pe ON p.id = pe.id_publicacion
         LEFT JOIN etiquetas e ON pe.id_etiqueta = e.id
         WHERE p.estado = 'activa' 
         AND (p.titulo ILIKE $1 OR p.descripcion ILIKE $2 OR e.nombre ILIKE $3)
         ORDER BY p.fecha_publicacion DESC`,
        [`%${termino}%`, `%${termino}%`, `%${termino}%`]
    );
    return resultado.rows;
}


async function cambiarEstado(id, estado) {
    await db.query(
        'UPDATE publicaciones SET estado = $1 WHERE id = $2',
        [estado, id]
    );
}

async function bajarPublicacion(id) {
    await db.query(
        'UPDATE publicaciones SET estado = $2 WHERE id = $1',
        [id, 'baja']
    );
    const resultado = await db.query(
        'SELECT id_autor FROM publicaciones WHERE id = $1',
        [id]
    );
    const id_autor = resultado.rows[0].id_autor;
    await db.query(
        'UPDATE usuarios SET pub_bajadas = pub_bajadas + 1 WHERE id = $1',
        [id_autor]
    );
    await db.query(
        'UPDATE usuarios SET activo = false WHERE id = $1 AND pub_bajadas >= 3',
        [id_autor]
    );
}

async function obtenerImagenPorId(id) {
    const resultado = await db.query(
        `SELECT img.*, p.id_autor, p.id as id_publicacion
         FROM imagenes img
         JOIN publicaciones p ON img.id_publicacion = p.id
         WHERE img.id = $1`,
        [id]
    );
    return resultado.rows[0];
}

async function eliminar(id) {
    await db.query('DELETE FROM publicaciones WHERE id = $1', [id]);
}

async function agregarEtiqueta(id_publicacion, id_etiqueta) {
    await db.query(
        'INSERT INTO publicaciones_etiquetas (id_publicacion, id_etiqueta) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id_publicacion, id_etiqueta]
    );
}

async function obtenerEtiquetas(id_publicacion) {
    const resultado = await db.query(
        `SELECT e.* FROM etiquetas e
         JOIN publicaciones_etiquetas pe ON e.id = pe.id_etiqueta
         WHERE pe.id_publicacion = $1`,
        [id_publicacion]
    );
    return resultado.rows;
}

module.exports = { crear, obtenerTodas, obtenerPorId, agregarImagen, obtenerImagenes, buscar, cambiarEstado, bajarPublicacion, obtenerImagenPorId, eliminar, agregarEtiqueta, obtenerEtiquetas};