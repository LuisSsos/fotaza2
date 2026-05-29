const db = require ('./db');

async function crear(datos) {
    const [resultado] = await db.query(
        'INSERT INTO publicaciones (id_autor, titulo, descripcion) VALUES (?, ?, ?)',
        [datos.id_autor, datos.titulo, datos.descripcion]
    );
    return resultado.insertId;
}

async function obtenerTodas() {
    const [filas] = await db.query(
        `SELECT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.estado = 'activa' 
         ORDER BY p.fecha_publicacion DESC`
    );
    return filas;
}

async function obtenerPorId(id) {
    const [filas] = await db.query(
        `SELECT p.*, u.nombre_usuario 
         FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.id = ?`,
        [id]
    );
    return filas[0];
}

async function agregarImagen(datos) {
    const [resultado] = await db.query(
        'INSERT INTO imagenes (id_publicacion, nombre_archivo,licencia) VALUES (?,?,?)',
        [datos.id_publicacion,datos.nombre_archivo,datos.licencia]
    );
    return resultado.insertId;
}
async function obtenerImagenes(id_publicacion) {
    const [filas] = await db.query(
        'SELECT * FROM imagenes WHERE id_publicacion = ?',
        [id_publicacion]
    );
    return filas;
}

async function buscar(termino) {
    const [filas] = await db.query(
        `SELECT p.*, u.nombre_usuario 
        FROM publicaciones p 
         JOIN usuarios u ON p.id_autor = u.id 
         WHERE p.estado = 'activa' 
         AND (p.titulo LIKE ? OR p.descripcion LIKE ?)
         ORDER BY p.fecha_publicacion DESC`,
        [`%${termino}%`, `%${termino}%`]
    );
    return filas;
}

module.exports = { crear, obtenerTodas, obtenerPorId, agregarImagen,obtenerImagenes,buscar};