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

module.exports = { verificarSesion, soloInvitados};