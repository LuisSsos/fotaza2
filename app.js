const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const rutasAuth = require('./rutas/auth');
const rutasPublicaciones = require('./rutas/publicaciones');
const usuarioModelo = require('./modelos/usuario');
const publicacionModelo = require('./modelos/publicacion');
const rutasUsuarios = require('./rutas/usuarios');
const notificacionModelo = require('./modelos/notificacion');
const rutasDenuncias = require('./rutas/denuncias');
const subida = require('./config/multer');
const app = express();
const rutasIntereses = require('./rutas/intereses');
const rutasColecciones = require('./rutas/colecciones');


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'vistas'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'publico')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const { verificarSesion } = require('./middlewares/auth');


app.use(async (req, res, next) => {
    if (req.session && req.session.usuario) {
        try {
            const noLeidas = await notificacionModelo.contarNoLeidas(req.session.usuario.id);
            res.locals.noLeidas = noLeidas;
        } catch (error) {
            console.error(error);
            res.locals.noLeidas = 0;
        }
    } else {
        res.locals.noLeidas = 0;
    }
    next();
});

app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

app.use('/auth', rutasAuth);
app.use('/publicaciones', rutasPublicaciones);
app.use('/usuarios', rutasUsuarios);
app.use('/denuncias', rutasDenuncias);
app.use('/intereses', rutasIntereses);
app.use('/colecciones', rutasColecciones);

app.get('/', async (req, res) => {
    const soloPublicas = !req.session.usuario;
    const publicaciones = await publicacionModelo.obtenerTodas(soloPublicas);
    res.render('home', { usuario: req.session.usuario || null, publicaciones });
});

app.get('/perfil', verificarSesion, async (req, res) => {
    const user = await usuarioModelo.buscarPorId(req.session.usuario.id);
    res.render('perfil', { usuario: user });
});

app.get('/perfil/editar', verificarSesion, (req, res) => {
    res.render('editar-perfil', { usuario: req.session.usuario });
});

app.post('/perfil/foto', verificarSesion, subida.single('foto'), async (req, res) => {
    await usuarioModelo.actualizarFotoPerfil(req.session.usuario.id, req.file.path);
    req.session.usuario.foto_perfil = req.file.path;
    req.session.save(() => res.redirect('/perfil'));
});

app.get('/notificaciones', verificarSesion, async (req, res) => {
    const notificaciones = await notificacionModelo.obtenerPorUsuario(req.session.usuario.id);
    res.render('notificaciones', { usuario: req.session.usuario, notificaciones });
});

app.post('/notificaciones/:id/leida', verificarSesion, async (req, res) => {
    await notificacionModelo.marcarLeida(req.params.id, req.session.usuario.id);
    res.redirect('/notificaciones');
});

app.get('/buscar', verificarSesion, async (req, res) => {
    const termino = req.query.q || '';
    const resultados = termino ? await publicacionModelo.buscar(termino) : [];
    res.render('buscar', { resultados, termino });
});

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor andando en http://localhost:${PUERTO}`);
});