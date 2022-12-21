import './App.css';
import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Posts from './components/Posts';

function App() {
  const [token, setToken] = useState(null)
  const [allPosts, setAllPosts] = useState([])
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {

  }, [token, allPosts, refresh])

  return (
    <div>
      {!token
        ? <Login token={token} setToken={setToken} />
        : <></>}
      <Posts token={token} allPosts={allPosts} setAllPosts={setAllPosts} refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
}

export default App;
