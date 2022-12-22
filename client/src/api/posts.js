const API_URL = 'http://localhost:3001/api' // Development
// const API_URL = process.env.REACT_APP_API_URL // Production

export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('error with fetchPosts', error)
  }
}

export const submitPost = async (token, title, content, tags) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        content,
        tags
      })
    })
    console.log(token)
    const data = await response.json()
    console.log('Data from newPost', data)
    return data
  } catch (error) {
    console.error('error with newPost', error)
  }
}