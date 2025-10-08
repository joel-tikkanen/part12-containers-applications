import React from 'react'

import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Toggable from './components/Toggable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => { return b.likes - a.likes }))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (!user && window.localStorage.getItem('loggedBlogUser')) {
    return <div>Loading...</div>
  }

  const loginForm = () => {
    if (user !== null) {
      return (
        <div>
          logged in as user {user.username}
          <form onSubmit={handleLogout}>
            <button type='submit'>log out</button>
          </form>
        </div>
      )
    }
    return (
      <div>
        <h2>login</h2>
        <form onSubmit={handleLogin}>
          username<input type="text" name="username" onChange={({ target }) => setUsername(target.value)} value={username} /><br />
          password<input type="password" onChange={({ target }) => setPassword(target.value)} value={password} /><br />
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('login succeeded')
      setMessageType('notification')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      console.log(exception)
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
    setMessage('logged out successfully')
    setMessageType('notification')
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog.data))
      setMessage(`new blog ${blogObject.title} added`)
      setMessageType('notification')
      setTimeout(() => setMessage(null), 3000)
    } catch (e) {
      setMessage(`log post failed ${e}`)
      setMessageType('error')
      setTimeout(() => setMessage(null), 3000)
    }
  }


  return (
    <div>
      <Notification message={errorMessage} type={messageType} />
      <h1>Blogs</h1>
      {loginForm()}
      <Toggable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm user={user} createBlog={handleCreate} />
      </Toggable>
      <div>
        <h2>blogs</h2>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} user={user} />)}
      </div>
    </div>
  )

}

export default App