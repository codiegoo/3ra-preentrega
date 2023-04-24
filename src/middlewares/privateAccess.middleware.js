function privateAccess(req, res, next) {
  if (!req.session.user) return res.redirect('/api/login')
  next()
}

module.exports = privateAccess