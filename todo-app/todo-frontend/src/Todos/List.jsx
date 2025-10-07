/* eslint-disable react/jsx-key */
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {

  return (
    <>
      {todos
        .map(todo => (
          <Todo
            key={todo._id}
            onClickComplete={completeTodo}
            onClickDelete={deleteTodo}
            todo={todo}
          />
        ))
        .reduce(
          (acc, cur, index) =>
            index === 0 ? [cur] : [...acc, <hr key={`hr-${index}`} />, cur],
          []
        )}
    </>
  )
}

export default TodoList
