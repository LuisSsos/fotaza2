const express = require('express');
const router = express.Router();
const publicacion = require('../modelos/publicacion');
const {verificarSesion} = require('../middlewares/auth')


router.get('/nueva', verificarSesion, (req,res) => {
    res.render('nueva-publicacion');
})

router.post('/nueva', verificarSesion,async (req,res) => {
    const { titulo, descripcion} = req.body;
    try{
        await publicacion.crear({
            id_autor: req.session.usuario.id,
            titulo,
            descripcion
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('nueva-publicacion'), { error: 'Error al crear la publicacion'}
    }
});

module.exports = router;
