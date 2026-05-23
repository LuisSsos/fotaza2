const express = require('express');
const session = require('express-session');
const path = require('path');
const rutasAuth = require('./rutas/auth');
const usuarioModelo = require('./modelos/usuario');
const rutasPublicaciones = require('./rutas/publicaciones');
require('dotenv').config();

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

app.get('/', verificarSesion, (req, res) => {
    res.render('home', { usuario: req.session.usuario });
});

app.get('/perfil', verificarSesion, async (req, res) => {
    const user = await usuarioModelo.buscarPorId(req.session.usuario.id);
    res.render('perfil', { usuario: user });
});

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor andando en http://localhost:${PUERTO}`);
});