
function verificarSesion(req, res, next) {
    if (!req.session || !req.session.usuario) {
        return res.redirect('/auth/login');
    }
    next();
}


function soloInvitados (req,res,next){
    if (req.session.usuario){
        return res.redirect('/')
    }
    next();
}


function soloValidador(req, res, next) {
    const rol = req.session.usuario.rol;
    if (rol !== 'validador' && rol !== 'admin') return res.redirect('/');
    next();
}

module.exports = { verificarSesion, soloInvitados, soloValidador };