function publicAccess(req, res, next) {
  console.log('middleware de acceso publico')
  if (req.session.user) {
    res.redirect('/api/dbProducts')
  } else {
    next()
  }
}

module.exports = publicAccess