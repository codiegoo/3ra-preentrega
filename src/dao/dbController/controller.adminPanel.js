const { Router } = require("express");
const adminAccess = require("../../middlewares/adminAcces.middleware");
const Users = require("../../models/Users.model");

const router = Router()

router.get('/',adminAccess,async (req, res, next) => {
  try {
    const users = await Users.find()
    res.render('adminPanel.handlebars', {users})
  } catch (error) {
    next(error)
  }
})


module.exports = router