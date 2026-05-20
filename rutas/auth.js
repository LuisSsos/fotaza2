const express = require ('express');
const bcrypt = require ('bcrypt');
const router = express.Router();
const usuario = require('../modelos/usuario');

router.get('/registro',(req,res) => {
    res.render('registro');
})

router.post('/registro',async (req,res) =>{
    const { nombre_usuario, correo,contrasena} = req.body;
    try{
        const existe = await usuario.buscarPorCorreo(correo);
        if(existe){
            return res.render('registro', {error: 'El correo ya esta registrado'});
        }
        const hash = await bcrypt.hash(contrasena,10);
        await usuario.crear ({ nombre_usuario, correo, contrasena: hash});
        res.redirect('/auth/login');
    } catch (err){
        console.error(err);
        res.render('registro', { error: 'Error al registrarse'});
    }
});

router.get('/login', (req,res) =>{
    res.render('login');
});

router.post('/login', async (req,res) =>{
    const { correo, contrasena } = req.body;
    try{
        const user = await usuario.buscarPorCorreo(correo);
        if(!user){
            return res.render('login', { error: 'Correo o contrasena incorrectos'});
        }
        const ok = await bcrypt.compare(contrasena, user.contrasena);
        if(!ok){
            return res.render ('login', {error: ' Correo o contrasena incorrectos'});
        }
        req.session.usuario = { id: user.id, nombre_usuario: user.nombre_usuario, rol: user.rol};
        res.redirect('/')
    }catch (err){
        console.error (err);
        res.render('login', { error: 'Error al iniciar sesion'});
    }
});

router.get('/logout', (req,res) =>{
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;