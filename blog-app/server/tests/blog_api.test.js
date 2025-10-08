const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')

const api = supertest(app)

const Blog = require('../models/blog')


const initialBlogs = [
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    userId: '6425d4e705d1e6eeb818e7c1',
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    userId: '6425d4e705d1e6eeb818e7c1',
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialBlogs[0])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[1])
  await noteObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.author)
  expect(contents).toContain('Robert C. Martin')
})

test('id exists', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('post worked', async () => {

  const newBlog = {
    id: 'lol',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    userId: '6425d4e705d1e6eeb818e7c1',
    __v: 0
  }

  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
  const response2 = await api.get('/api/blogs')
  expect(response2.body).toHaveLength(initialBlogs.length+1)
})

test('default value of likes is set to 0', async () => {

  const newBlog = {
    id: 'lol',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: undefined,
    __v: 0,
    userId: '6425d4e705d1e6eeb818e7c1',
  }

  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
  const response2 = await api.get('/api/blogs')
  expect(response2.body[2].likes).toBe(0)
})

test('post without title or url equals as 400 bad request', async () => {

  const newBlog = {
    id: 'lol',
    author: 'Robert C. Martin',
    likes: undefined,
    userId: '6425d4e705d1e6eeb818e7c1'
  }
  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('delete by id', async () => {
  await api.delete('/api/blogs/'+initialBlogs[0]._id)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(1)
})


test('update by id', async () => {
  const update = { likes: 420 }
  await api.put('/api/blogs/5a422b891b54a676234d17fa').send(update)
  const response = await api.get('/api/blogs')
  expect(listHelper.favoriteBlog(response.body).likes).toBe(420)
})

afterAll(async () => {
  await mongoose.connection.close()
})

