const express = require('express');
const router = express.Router();
const publicacion = require('../modelos/publicacion');
const {verificarSesion} = require('../middlewares/auth')
const subida = require('../config/multer');
const comentario = require('../modelos/comentario')
const valoracion = require('../modelos/valoracion');

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

router.post('/:id/comentar', verificarSesion, async (req,res) =>{
    try{
        await comentario.crear ({
            id_publicacion: req.params.id,
            id_autor: req.session.usuario.id,
            contenido: req.body.contenido
        });
res.redirect('/publicaciones/' + req.params.id);
    } catch (err){
        console.error(err);
        res.redirect('/publicaciones/' + req.params.id)
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
        res.redirect('/publicaciones/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/publicaciones/' + req.params.id);
    }
});


router.get('/:id', verificarSesion, async (req, res) => {
    try {
        const pub = await publicacion.obtenerPorId(req.params.id);
        if (!pub) return res.redirect('/');
        const imagenes = await publicacion.obtenerImagenes(req.params.id);
        const comentarios = await comentario.obtenerPorPublicacion(req.params.id)

        for (const img of imagenes) {
            const val = await valoracion.obtenerPromedio(img.id);
            img.promedio = val.promedio ? parseFloat(val.promedio).toFixed(1) : 'Sin valoraciones';
            img.total_votos = val.total;
        }

        res.render('publicacion', { publicacion: pub, imagenes,comentarios });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;
