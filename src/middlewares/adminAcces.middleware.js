function adminAccess(req, res, next){
  if(req.user.role === 'administrador'){
    next()
  }else{
    res.status(401).json({error: 'Acceso denegado, no tienes permisos de administrador!'})
  }
}

module.exports = adminAccess