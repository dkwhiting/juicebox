import React, { useState } from 'react'
import { loginUser } from '../api/auth'

const Posts = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = async (event) => {
    event.preventDefault()
    await loginUser(username, password)
  }

  return (
    <div>
      <form onSubmit={(event) => submitHandler(event)}>
        <input value={username} type="text" placeholder="username" onChange={(event) => setUsername(event.target.value)}></input>
        <input value={password} type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)}></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Posts;