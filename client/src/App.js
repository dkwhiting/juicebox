import './App.css';
import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Posts from './components/Posts';
import NewPost from './components/NewPost'
import { fetchUser } from './api/auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [allPosts, setAllPosts] = useState([])
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(token)
      setUser(user)
    }
    if (token) {
      getUser()
      console.log(user)
    }
  }, [token])

  return (
    <div>
      <button onClick={() => console.log(token)}>log</button>
      {!token
        ? <Login token={token} setToken={setToken} />
        : <><button onClick={() => {
          localStorage.removeItem('token');
          setToken(null)
          setUser(null)
        }}>Logout</button>
          <NewPost token={token} refresh={refresh} setRefresh={setRefresh} /></>
      }
      <Posts token={token} allPosts={allPosts} setAllPosts={setAllPosts} refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
}

export default App;
