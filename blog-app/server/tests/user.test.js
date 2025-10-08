const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
describe('tests for user creation', () => {

  beforeAll(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creating user with password length below 3', async () => {

    const newUser = {
      username: 'matti',
      name: 'Matti',
      password: 'm'
    }

    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body.error).toBe('passwords length must be atleast three')
  })

  test('creating user with correct input', async () => {
    const usersBefore = await helper.usersInDb()
    const name = Math.random().toString(36).slice(2, 7)
    const newUser = {
      username: name,
      name: 'Matti',
      password: 'make'
    }

    const response = await api.post('/api/users').send(newUser).expect(201)

    const usersAfter = await helper.usersInDb()
    expect(response.body.username).toBe(name)
    expect(usersAfter.length).toBe(usersBefore.length+1)



  })


  test('creating user with same name', async () => {
    const usersBefore = await helper.usersInDb()
    console.log('a ' + usersBefore)
    const newUser = {
      username: 'root',
      password: 'make'
    }

    await api.post('/api/users').send(newUser).expect(400)
    const usersAfter = await helper.usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
  })

})

const mongoose = require('mongoose')

afterAll(async () => {
  await mongoose.connection.close()
})