const db = require('./db');

async function crear(datos) {
    const resultado = await db.query(
        'INSERT INTO publicaciones (id_autor, titulo, descripcion) VALUES ($1, $2, $3) RETURNING id',
        [datos.id_autor, datos.titulo, datos.descripcion]
    );
    return resultado.rows[0].id;
}

async function obtenerTodas() {
    const resultado = await db.query(
        `SELECT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.estado = 'activa' 
         ORDER BY p.fecha_publicacion DESC`
    );
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
        `SELECT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.estado = 'activa' 
         AND (p.titulo ILIKE $1 OR p.descripcion ILIKE $2)
         ORDER BY p.fecha_publicacion DESC`,
        [`%${termino}%`, `%${termino}%`]
    );
    return resultado.rows;
}

module.exports = { crear, obtenerTodas, obtenerPorId, agregarImagen, obtenerImagenes, buscar };