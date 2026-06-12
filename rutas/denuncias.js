const express = require('express');
const router = express.Router();
const denuncia = require('../modelos/denuncia');
const publicacion = require('../modelos/publicacion');
const { verificarSesion } = require('../middlewares/auth');

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
        const { id_motivo, justificacion, id_publicacion } = req.body;
        await denuncia.denunciarImagen({
            id_imagen: req.params.id_imagen,
            id_usuario: req.session.usuario.id,
            id_motivo,
            justificacion
        });
        const total = await denuncia.contarDenunciasImagen(req.params.id_imagen);
        if (total >= 3) {
            await publicacion.cambiarEstado(id_publicacion, 'en_revision');
        }
        res.redirect('/publicaciones/' + id_publicacion);
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.get('/validador', verificarSesion, async (req, res) => {
    try {
        if (req.session.usuario.rol !== 'validador' && req.session.usuario.rol !== 'admin') {
            return res.redirect('/');
        }
        const publicaciones = await denuncia.obtenerPublicacionesEnRevision();
        res.render('validador', { publicaciones, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/validador/:id_publicacion/bajar', verificarSesion, async (req, res) => {
    try {
        if (req.session.usuario.rol !== 'validador' && req.session.usuario.rol !== 'admin') {
            return res.redirect('/');
        }
        await publicacion.bajarPublicacion(req.params.id_publicacion);
        res.redirect('/denuncias/validador');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/validador/:id_publicacion/desestimar', verificarSesion, async (req, res) => {
    try {
        if (req.session.usuario.rol !== 'validador' && req.session.usuario.rol !== 'admin') {
            return res.redirect('/');
        }
        await publicacion.cambiarEstado(req.params.id_publicacion, 'activa');
        res.redirect('/denuncias/validador');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;