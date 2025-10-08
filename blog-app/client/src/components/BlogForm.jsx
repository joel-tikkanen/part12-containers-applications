import React from 'react'

import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog, user }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    setAuthor('')
    setTitle('')
    setUrl('')
    createBlog({
      title: title,
      author: author,
      url: url
    })
  }

  if (user!==null) {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
        title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} placeholder='title'/>
        author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} placeholder='author'/>
        url: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} placeholder='url'/>
          <button type='submit'>create</button>
        </form>
      </div>
    )
  }
}


BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default BlogForm