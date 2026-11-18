const express = require('express');
const router = express.Router();
const denuncia = require('../modelos/denuncia');
const publicacion = require('../modelos/publicacion');
const comentario = require('../modelos/comentario');
const { verificarSesion, soloValidador } = require('../middlewares/auth');

router.get('/imagen/:id_imagen', verificarSesion, async (req, res) => {
    try {
        const motivos = await denuncia.obtenerMotivos();
        res.render('denunciar', { motivos, id_imagen: req.params.id_imagen, id_publicacion: req.query.id_publicacion });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/imagen/:id_imagen', verificarSesion, async (req, res) => {
    try {
        const { id_motivo, justificacion } = req.body;
        const img = await publicacion.obtenerImagenPorId(req.params.id_imagen);

        // no se puede denunciar la imagen propia
        if (!img || img.id_autor === parseInt(req.session.usuario.id)) return res.redirect('/');
        const id_publicacion = img.id_publicacion;
        if (!justificacion || !justificacion.trim()) return res.redirect('/denuncias/imagen/' + req.params.id_imagen + '?id_publicacion=' + id_publicacion);
        await denuncia.denunciarImagen({
            id_imagen: req.params.id_imagen,
            id_usuario: req.session.usuario.id,
            id_motivo,
            justificacion
        });
        const total = await denuncia.contarDenunciasImagen(req.params.id_imagen);
        // con mas de 3 denuncias la publicacion pasa a revision del validador
        if (total > 3) {
            await publicacion.cambiarEstado(id_publicacion, 'en_revision');
        }
        res.redirect('/publicaciones/' + id_publicacion);
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.get('/comentario/:id_comentario', verificarSesion, async (req, res) => {
    try {
        const motivos = await denuncia.obtenerMotivos();
        res.render('denunciar-comentario', { motivos, id_comentario: req.params.id_comentario, id_publicacion: req.query.id_publicacion });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/comentario/:id_comentario', verificarSesion, async (req, res) => {
    const { id_motivo, justificacion, id_publicacion } = req.body;
    try {
        const com = await comentario.obtenerPorId(req.params.id_comentario);
        const pub = await publicacion.obtenerPorId(id_publicacion);
        const yo = parseInt(req.session.usuario.id);
        if (!com || !pub || com.eliminado || com.id_publicacion !== pub.id) return res.redirect('/');
        if (com.id_autor === yo || com.id_autor === pub.id_autor) return res.redirect('/publicaciones/' + id_publicacion);
        await denuncia.denunciarComentario({ id_comentario: com.id, id_usuario: yo, id_motivo, justificacion });
        res.redirect('/publicaciones/' + id_publicacion);
    } catch (err) {
        console.error(err);
        res.redirect('/publicaciones/' + id_publicacion);
    }
});

router.get('/validador', verificarSesion, soloValidador, async (req, res) => {
    try {
        const publicaciones = await denuncia.obtenerPublicacionesEnRevision();
        res.render('validador', { publicaciones, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/validador/:id_publicacion/bajar', verificarSesion, soloValidador, async (req, res) => {
    try {
        await publicacion.bajarPublicacion(req.params.id_publicacion);
        res.redirect('/denuncias/validador');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/validador/:id_publicacion/desestimar', verificarSesion, soloValidador, async (req, res) => {
    try {
        await publicacion.cambiarEstado(req.params.id_publicacion, 'activa');
        res.redirect('/denuncias/validador');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;