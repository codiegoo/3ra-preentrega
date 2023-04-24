function publicAccess(req, res, next) {
  if (req.session.user) return res.redirect('/api/dbProducts')

  next()
}

module.exports = publicAccess