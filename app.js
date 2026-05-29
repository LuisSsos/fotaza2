const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const rutasAuth = require('./rutas/auth');
const rutasPublicaciones = require('./rutas/publicaciones');
const usuarioModelo = require('./modelos/usuario');
const publicacionModelo = require('./modelos/publicacion');
const rutasUsuarios = require('./rutas/usuarios')
const app = express();

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

app.use('/auth', rutasAuth);
app.use('/publicaciones', rutasPublicaciones);
app.use('/usuarios', rutasUsuarios);
app.get('/', verificarSesion, async (req, res) => {
    const publicaciones = await publicacionModelo.obtenerTodas();
    res.render('home', { usuario: req.session.usuario, publicaciones });
});

app.get('/perfil', verificarSesion, async (req, res) => {
    const user = await usuarioModelo.buscarPorId(req.session.usuario.id);
    res.render('perfil', { usuario: user });
});

app.get('/buscar', verificarSesion, async (req,res) => {
    const termino = req.query.q || '';
    const resultados = termino ? await publicacionModelo.buscar(termino): [];
    res.render('buscar', { resultados,termino})
})
const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor andando en http://localhost:${PUERTO}`);
});