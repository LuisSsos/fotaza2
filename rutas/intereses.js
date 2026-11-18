const express = require('express');
const router = express.Router();
const interes = require('../modelos/interes');
const mensaje = require('../modelos/mensaje');
const notificacion = require('../modelos/notificacion');
const publicacion = require('../modelos/publicacion');
const { verificarSesion } = require('../middlewares/auth');

router.post('/imagen/:id_imagen', verificarSesion, async (req, res) => {
    try {
        const imagenes = await publicacion.obtenerImagenPorId(req.params.id_imagen);
        if (parseInt(imagenes.id_autor) === parseInt(req.session.usuario.id)) return res.redirect('/');
        const nuevo = await interes.registrar(req.params.id_imagen, req.session.usuario.id);
        if (nuevo) {
            await notificacion.crear({
                id_destinatario: imagenes.id_autor,
                id_actor: req.session.usuario.id,
                tipo: 'interes',
                id_publicacion: imagenes.id_publicacion
            });
        }
        res.redirect('/intereses/conversaciones');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.get('/conversaciones', verificarSesion, async (req, res) => {
    try {
        const conversaciones = await interes.obtenerConversaciones(req.session.usuario.id);
        res.render('conversaciones', { conversaciones, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.get('/chat/:id_interes', verificarSesion, async (req, res) => {
    try {
        const conv = await interes.obtenerPorId(req.params.id_interes);
        if (!conv) return res.redirect('/intereses/conversaciones');
        if (conv.id_usuario !== req.session.usuario.id && conv.id_autor !== req.session.usuario.id) {
            return res.redirect('/');
        }
        const mensajes = await mensaje.obtenerPorInteres(req.params.id_interes);
        res.render('chat', { mensajes, conv, usuario: req.session.usuario });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/chat/:id_interes', verificarSesion, async (req, res) => {
    try {
        const conv = await interes.obtenerPorId(req.params.id_interes);
        if (!conv) return res.redirect('/intereses/conversaciones');
        if (conv.id_usuario !== req.session.usuario.id && conv.id_autor !== req.session.usuario.id) {
            return res.redirect('/');
        }
        await mensaje.enviar(req.params.id_interes, req.session.usuario.id, req.body.contenido);
        res.redirect('/intereses/chat/' + req.params.id_interes);
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;