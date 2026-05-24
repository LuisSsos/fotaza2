const express = require('express');
const router = express.Router();
const publicacion = require('../modelos/publicacion');
const {verificarSesion} = require('../middlewares/auth')
const subida = require('../config/multer');

router.get('/nueva', verificarSesion, (req,res) => {
    res.render('nueva-publicacion');
})



router.post('/nueva', verificarSesion,subida.array('imagenes',10),async (req,res) => {
    const { titulo, descripcion, licencia} = req.body;
    try{
        const id_publicacion= await publicacion.crear({
            id_autor: req.session.usuario.id,
            titulo,
            descripcion
        });

        if(req.files && req.files.length > 0) {
            for (const archivo of req.files){
                await publicacion.agregarImagen({
                    id_publicacion,
                    nombre_archivo: archivo.filename,
                    licencia: licencia || 'libre'
                });
            }
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('nueva-publicacion'), { error: 'Error al crear la publicacion'}
    }
});

router.get('/:id', verificarSesion, async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub) return res.redirect('/');
        const imagenes = await publicacion.obtenerImagenes(req.params.id);
        res.render('publicacion', { publicacion: pub, imagenes });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;
