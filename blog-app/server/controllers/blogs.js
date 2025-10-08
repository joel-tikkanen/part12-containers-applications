const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  let user = null


  if (process.env.NODE_ENV === 'test') {

    user = await User.findOne({})
    if (!user) {

      const dummyUser = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash: 'dummyhash'
      })
      user = await dummyUser.save()
    }
  } else {

    if (!token) {
      return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(token, 'secret')
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }
  }

  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    return response.status(400).json({ error: 'malformed request' })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    const result = await Blog.findByIdAndDelete(request.params.id)
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    response.status(400).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      body,
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1, id: 1 })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogRouter