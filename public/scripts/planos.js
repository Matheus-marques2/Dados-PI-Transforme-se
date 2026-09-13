// Controle de planos e feature flags

// Retorna o objeto do plano de um usuário, ou o plano Gratuito se algo estiver errado
function pegarPlanoDoUsuario(db, idUsuario) {

    const usuarios = Object.values(db.usuarios);
    const usuario = usuarios.find(function(u) {
        return u.id_usuario === idUsuario;
    });

    const idPlano = (usuario && usuario.id_plano) ? usuario.id_plano : 1;

    return db.planos[idPlano] || db.planos[1];
}

// Verifica se o usuário tem acesso a uma feature específica
function usuarioTemAcesso(db, idUsuario, feature) {
    const plano = pegarPlanoDoUsuario(db, idUsuario);
    return plano.features[feature] === true;
}

// Middleware pronto pra proteger rotas que exigem uma feature de um plano pago
function exigirFeature(db, feature) {
    return function(request, response, next) {
        if(!request.session.usuario){
            response.status(401).json({ erro: "Não autenticado" });
            return;
        }

        if(!usuarioTemAcesso(db, request.session.usuario.id_usuario, feature)){
            response.status(403).json({ erro: "Seu plano atual não tem acesso a este recurso" });
            return;
        }

        next();
    };
}

module.exports = {
    pegarPlanoDoUsuario,
    usuarioTemAcesso,
    exigirFeature
};