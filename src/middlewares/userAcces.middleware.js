function userAcces(req, res, next) {
  if(req.user.role === 'usuario'){
    next()
  }else{
    res.status(401).json({error: 'Acceso denegado, no tienes permisos de usuario!'})
  }
}

module.exports = userAcces