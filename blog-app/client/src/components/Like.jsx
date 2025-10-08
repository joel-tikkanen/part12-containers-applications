import React from 'react'

const Like = ({ id, likes, onLike }) => {
  return (
    <form id={id} name={likes} onSubmit={onLike}><button type='submit'>like</button></form>
  )
}

export default Like