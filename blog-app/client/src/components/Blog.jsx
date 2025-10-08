import React from 'react'

import Togglable from './Toggable'
import Like from './Like'
import blogService from '../services/blogs'
import { useRef } from 'react'

const Blog = ({ blog, user }) => {

  const blogViewRef = useRef()

  const handleView = () => {
    blogViewRef.current.toggleVisibility()
  }

  const handleLike = async (event) => {
    event.preventDefault()
    const response = blogService.update(event.target.id, { likes: parseInt(event.target.name) + 1 })
    return response
  }
  const handleDelete = async (event) => {
    event.preventDefault()
    const response = await blogService.remove(event.target.id)
    return response
  }

  let id

  try {
    id = blog.user.id
  } catch (e) {
    id = ''
    console.log(e)
  }

  return (
    <div>
      {blog.title} {blog.author}
      <Togglable buttonLabel='view' ref={blogViewRef}>
        <p>title: {blog.title}</p>
        <p>author: {blog.author}</p>
        <p>url: {blog.url}</p>
        <p>likes: {blog.likes}</p>
        {user && user.id === id && <form id={blog.id} onSubmit={handleDelete}><button>delete</button></form>}
        <Like onLike={handleLike} id={blog.id} likes={blog.likes} />
        <button onClick={handleView}>hide</button>
      </Togglable>
    </div>
  )
}

export default Blog