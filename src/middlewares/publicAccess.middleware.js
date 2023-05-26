function publicAccess(req, res, next) {
  if (req.session.user) {
    res.redirect('/api/dbProducts')
  } else {
    next()
  }
}

module.exports = publicAccess