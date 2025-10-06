/* eslint-disable react/jsx-key */
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {

  console.log(todos)
  {
    todos
      .map(todo => {
        return (
          <Todo
            key={todo._id}
            onClickComplete={completeTodo}
            onClickDelete={deleteTodo}
            todo={todo}
          />
        )
      })
    .reduce((acc, cur) => [...acc, <hr key={Math.random()} />, cur], [])
  }
}

export default TodoList
