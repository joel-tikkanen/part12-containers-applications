const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  if (password.length < 3) return response.status(400).json({ error: 'passwords length must be atleast three' })
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (err) {
    return next(err)
  }
})


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  console.log(users)
  response.status(200).json(users)
})

module.exports = usersRouter