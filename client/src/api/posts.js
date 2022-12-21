const API_URL = process.env.REACT_APP_API_URL

export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`)
    const data = await response.json()
    console.log("THIS IS FETCHPOSTS", data)
    return data
  } catch (error) {

  }
}