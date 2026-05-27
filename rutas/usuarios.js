const express = require('express');
const router = express.Router();
const seguidor = require('../modelos/seguidor');
const { verificarSesion } = require('../middlewares/auth');

router.post('/:id/seguir', verificarSesion, async (req,res) => {
    const id_seguido = parseInt(req.params.id);
    const id_seguidor = req.session.usuario.id;
    try {
        if(id_seguido === id_seguidor) return res.redirect('/perfil');
        const ya= await seguidor.estaSiguiendo(id_seguidor,id_seguido);
        if (ya){
            await seguidor.dejarDeSeguir(id_seguidor,id_seguido);
        } else {
            await seguidor.seguir(id_seguidor, id_seguido);
        }
        res.redirect('/usuarios/' + id_seguido);
    }catch (err){
        console.error (err);
        res.redirect('/');
    }
});

router.get('/:id', verificarSesion, async (req,res) =>{
    try{
        const usuarioModelo = require ('../modelos/usuario');
        const user = await usuarioModelo.buscarPorId(req.params.id);
        if (!user) return res.redirect('/');
        const seguidores = await seguidor.contarSeguidores(req.params.id);
        const seguidos = await seguidor.contarSeguidos(req.params.id);
        const estaSig = await seguidor.estaSiguiendo(req.session.usuario.id);
        res.render('perfil-usuario', { user, seguidores, seguidos, estaSig, usuarioActual: req.session.usuario})
    } catch (err){
        console.error(err);
        res.redirect('/')
    }
})

module.exports = router;