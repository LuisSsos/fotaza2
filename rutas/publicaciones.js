const express = require('express');
const router = express.Router();
const publicacion = require('../modelos/publicacion');
const { verificarSesion } = require('../middlewares/auth');
const subida = require('../config/multer');
const comentario = require('../modelos/comentario');
const valoracion = require('../modelos/valoracion');
const notificacion = require('../modelos/notificacion');
const etiqueta = require('../modelos/etiqueta');
const denuncia = require('../modelos/denuncia');

router.get('/nueva', verificarSesion, (req, res) => {
    res.render('nueva-publicacion', { usuario: req.session.usuario });
});

router.post('/nueva', verificarSesion, subida.array('imagenes', 10), async (req, res) => {
    const { titulo, descripcion, licencia } = req.body;
    const marca = licencia === 'copyright' ? (req.body.marca_agua || '').replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 40) : '';
    try {
        if (!req.files || req.files.length === 0) {
            return res.render('nueva-publicacion', { error: 'Tenes que subir al menos una imagen', usuario: req.session.usuario });
        }

        const id_publicacion = await publicacion.crear({
            id_autor: req.session.usuario.id,
            titulo,
            descripcion
        });

        for (const archivo of req.files) {
            await publicacion.agregarImagen({
                id_publicacion,
                nombre_archivo: archivo.path,
                licencia: licencia || 'libre',
                marca_agua: marca || null
            });
        }

        if (req.body.etiquetas) {
            const tags = req.body.etiquetas.split(',');
            for (const tag of tags) {
                if (tag.trim()) {
                    const etiq = await etiqueta.buscarOCrear(tag.trim());
                    await publicacion.agregarEtiqueta(id_publicacion, etiq.id);
                }
            }
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('nueva-publicacion', { error: 'Error al crear la publicacion', usuario: req.session.usuario });
    }
});

router.post('/:id/comentar', verificarSesion, async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub || !pub.comentarios_abiertos) return res.redirect('/publicaciones/' + req.params.id);
        await comentario.crear({
            id_publicacion: req.params.id,
            id_autor: req.session.usuario.id,
            contenido: req.body.contenido
        });
        if (parseInt(req.session.usuario.id) !== pub.id_autor) {
            await notificacion.crear({
                id_destinatario: pub.id_autor,
                id_actor: req.session.usuario.id,
                tipo: 'comentario',
                id_publicacion: req.params.id
            });
        }
        res.redirect('/publicaciones/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/publicaciones/' + req.params.id);
    }
});

router.post('/:id/imagen/:id_imagen/valorar', verificarSesion, async (req, res) => {
    try {
        const ya = await valoracion.yaValoro(req.params.id_imagen, req.session.usuario.id);
        console.log('ya valoro:', ya);
        const pub = await publicacion.obtenerPorId(req.params.id);
        console.log('autor pub:', pub.id_autor, 'usuario sesion:', req.session.usuario.id);
        if (ya) return res.redirect('/publicaciones/' + req.params.id);
        if (pub.id_autor === parseInt(req.session.usuario.id)) return res.redirect('/publicaciones/' + req.params.id);
        await valoracion.valorar({
            id_imagen: req.params.id_imagen,
            id_usuario: req.session.usuario.id,
            valor: req.body.valor
        });
        await notificacion.crear({
            id_destinatario: pub.id_autor,
            id_actor: req.session.usuario.id,
            tipo: 'valoracion',
            id_publicacion: req.params.id
        });
        res.redirect('/publicaciones/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/publicaciones/' + req.params.id);
    }
});

router.post('/:id/eliminar', verificarSesion, async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub || pub.id_autor !== parseInt(req.session.usuario.id)) return res.redirect('/');
        const denuncias = await denuncia.obtenerDenunciasPublicacion(req.params.id);
        if (denuncias.length > 0) return res.redirect('/publicaciones/' + req.params.id);
        await publicacion.eliminar(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/:id/comentarios/toggle', verificarSesion, async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub || pub.id_autor !== parseInt(req.session.usuario.id)) return res.redirect('/');
        await publicacion.toggleComentarios(req.params.id);
        res.redirect('/publicaciones/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/publicaciones/' + req.params.id);
    }
});

router.post('/:id/comentarios/:id_comentario/eliminar', verificarSesion, async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub || pub.id_autor !== parseInt(req.session.usuario.id)) return res.redirect('/');
        const com = await comentario.obtenerPorId(req.params.id_comentario);
        if (!com || com.id_publicacion !== pub.id) return res.redirect('/');
        await comentario.eliminar(com.id);
        res.redirect('/publicaciones/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/publicaciones/' + req.params.id);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub) return res.redirect('/');
        let imagenes = await publicacion.obtenerImagenes(req.params.id);
        if (!req.session.usuario) {
            imagenes = imagenes.filter(img => img.licencia === 'libre');
            if (imagenes.length === 0) return res.redirect('/auth/login');
        }
        const comentarios = await comentario.obtenerPorPublicacion(req.params.id);
        const etiquetas = await publicacion.obtenerEtiquetas(req.params.id);
        let denunciasComentarios = [];
        if (req.session.usuario && req.session.usuario.id == pub.id_autor) {
            denunciasComentarios = await denuncia.obtenerDenunciasComentarios(req.params.id);
        }

        for (const img of imagenes) {
            const val = await valoracion.obtenerPromedio(img.id);
            img.promedio = val.promedio ? parseFloat(val.promedio).toFixed(1) : 'Sin valoraciones';
            img.total_votos = val.total;
            if (img.licencia === 'copyright') {
            const texto = encodeURIComponent(img.marca_agua || pub.nombre_usuario);
            img.nombre_archivo = img.nombre_archivo.replace('/upload/', `/upload/c_limit,w_800/co_white,b_black,o_60,l_text:Arial_40_bold:${texto}/fl_layer_apply,g_south_east,x_15,y_15/`);
            }
        }

        res.render('publicacion', { publicacion: pub, imagenes, comentarios, etiquetas, denunciasComentarios, usuario: req.session.usuario || null });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;