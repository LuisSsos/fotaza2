const express = require('express');
const router = express.Router();
const coleccion = require('../modelos/coleccion');
const { verificarSesion } = require('../middlewares/auth');

router.get('/seleccionar', verificarSesion, async (req, res) => {
    try {
        const colecciones = await coleccion.obtenerPorUsuario(req.session.usuario.id);
        const id_publicacion = req.query.id_publicacion;
        res.render('seleccionar-coleccion', { colecciones, id_publicacion, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/seleccionar', verificarSesion, async (req, res) => {
    try {
        const { id_coleccion, id_publicacion } = req.body;
        await coleccion.agregarPublicacion(id_coleccion, id_publicacion);
        res.redirect('/publicaciones/' + id_publicacion);
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.get('/', verificarSesion, async (req, res) => {
    try {
        const colecciones = await coleccion.obtenerPorUsuario(req.session.usuario.id);
        res.render('colecciones', { colecciones, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/nueva', verificarSesion, async (req, res) => {
    try {
        if (!req.body.nombre || req.body.nombre.trim() === '') return res.redirect('/colecciones');
        await coleccion.crear(req.session.usuario.id, req.body.nombre);
        res.redirect('/colecciones');
    } catch (err) {
        console.error(err);
        res.redirect('/colecciones');
    }
});

router.post('/:id/agregar', verificarSesion, async (req, res) => {
    try {
        const col = await coleccion.obtenerPorId(req.params.id);
        if (!col || col.id_usuario !== parseInt(req.session.usuario.id)) return res.redirect('/');
        await coleccion.agregarPublicacion(req.params.id, req.body.id_publicacion);
        res.redirect('/publicaciones/' + req.body.id_publicacion);
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/:id/eliminar', verificarSesion, async (req, res) => {
    try {
        const col = await coleccion.obtenerPorId(req.params.id);
        if (!col || col.id_usuario !== parseInt(req.session.usuario.id)) return res.redirect('/');
        await coleccion.eliminar(req.params.id);
        res.redirect('/colecciones');
    } catch (err) {
        console.error(err);
        res.redirect('/colecciones');
    }
});

router.get('/:id', verificarSesion, async (req, res) => {
    try {
        const col = await coleccion.obtenerPorId(req.params.id);
        if (!col || col.id_usuario !== parseInt(req.session.usuario.id)) return res.redirect('/');
        const publicaciones = await coleccion.obtenerPublicaciones(req.params.id);
        res.render('coleccion-detalle', { col, publicaciones, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;