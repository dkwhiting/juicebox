import React, { useState } from 'react'
import { loginUser, getPosts } from '../api/auth'

const Login = ({ token, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const submitHandler = async (event) => {
    event.preventDefault()
    const data = await loginUser(username, password)
    setToken(data.token)
    localStorage.setItem('token', data.token)
    console.log(data)
  }

  return (
    <div id="login">
      <h1>Please Login or Register</h1>
      <form onSubmit={(event) => submitHandler(event)}>
        <input value={username} type="text" placeholder="username" onChange={(event) => setUsername(event.target.value)}></input>
        <input value={password} type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)}></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Login;