import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import Todo from './Todo'

describe('<Todo />', () => {
  const testTodo = { text: 'Complete the exercise', done: false }

  test('renders the todo text', () => {
    render(<Todo todo={testTodo} onClickDelete={() => {}} onClickComplete={() => {}} />)
    expect(screen.getByText('Complete the exercise')).toBeInTheDocument()
  })

  test('renders correct info when not done', () => {
    render(<Todo todo={testTodo} onClickDelete={() => {}} onClickComplete={() => {}} />)
    expect(screen.getByText('This todo is not done')).toBeInTheDocument()
    expect(screen.getByText('Set as done')).toBeInTheDocument()
  })

  test('renders correct info when done', () => {
    const doneTodo = { text: 'Complete the exercise', done: true }
    render(<Todo todo={doneTodo} onClickDelete={() => {}} onClickComplete={() => {}} />)
    expect(screen.getByText('This todo is done')).toBeInTheDocument()
    expect(screen.queryByText('Set as done')).not.toBeInTheDocument()
  })

  test('calls delete handler when Delete clicked', () => {
    const handleDelete = vi.fn()
    render(<Todo todo={testTodo} onClickDelete={handleDelete} onClickComplete={() => {}} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(handleDelete).toHaveBeenCalledWith(testTodo)
  })

  test('calls complete handler when Set as done clicked', () => {
    const handleComplete = vi.fn()
    render(<Todo todo={testTodo} onClickDelete={() => {}} onClickComplete={handleComplete} />)
    fireEvent.click(screen.getByText('Set as done'))
    expect(handleComplete).toHaveBeenCalledWith(testTodo)
  })
})
