// const API_URL = 'http://localhost:3001/api' // Development
// const API_URL = process.env.REACT_APP_API_URL // Production
const API_URL = RENDER_EXTERNAL_URL // Production (Temporary Fix)

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


export const fetchUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    return data
  } catch (error) {

  }
}