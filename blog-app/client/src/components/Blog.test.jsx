import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Like from './Like'
import BlogForm from './BlogForm'
import { test,expect, vi } from 'vitest'

test('renders title and author while not rendering likes', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0,
  }
  render(<Blog blog={blog} user={{ id: 1 }}/>)
  screen.debug()
  const element = screen.getByText('title author')
  expect(element).toBeVisible()

  const element2 = screen.getByText('likes: 0')
  expect(element2).not.toBeVisible()

})


test('renders url and likes when view is clicked', async () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0,
  }
  render(<Blog blog={blog} user={{ id: 1 }}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  expect(screen.getByText('likes: 0')).not.toBeVisible()
  await user.click(button)
  expect(screen.getByText('likes: 0')).toBeVisible()
  expect(screen.getByText('url: url')).toBeVisible()
})


test('if like button is pressed twice will the callback function be called twice ', async () => {

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(
    <Like id={1} likes={0} onLike={mockHandler}/>
  )

  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})


test('correct callback function with correct data when blog is', async () => {

  const mockHandler = vi.fn()
  const user = userEvent.setup()


  render(<BlogForm createBlog={mockHandler} user={{ id: 1 }}/>)

  screen.debug()

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const button = screen.getByText('create')

  await user.type(titleInput, 'title')
  await user.type(authorInput, 'author')
  await user.type(urlInput, 'url')
  await button.click(button)
  const values = mockHandler.mock.calls[0][0]

  expect(values.title).toBe('title')
  expect(values.author).toBe('author')
  expect(values.url).toBe('url')
})