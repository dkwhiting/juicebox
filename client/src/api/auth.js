const API_URL = process.env.REACT_APP_API_URL

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

        username,
        password

      })
    })
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
  }
}


export const getPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`)
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
  }
}