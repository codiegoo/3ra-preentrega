const { Router } = require('express')
const Users = require('../models/Users.model')
const Cart = require('../models/Carts.model')
const {usersCreate} = require('../dbDao/users.dao')

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body
    const userInfo = {
      first_name,
      last_name,
      email,
      age,
      password
    }
    const newUser = await usersCreate(userInfo)

    res.status(201).json({ status: 'success', message: newUser })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ status: 'error', error: 'Internal server error' })
  }
})

router.get('/', (req, res) => {
  try {
    res.render('register.handlebars')
  } catch (error) {
    res.status(400).json({error: error})
  }
})

module.exports = router