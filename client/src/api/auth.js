const PORT = 'http://localhost:8080/api'

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${PORT}/users/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          username,
          password
        }
      })
    })
    const data = await response.json();
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}