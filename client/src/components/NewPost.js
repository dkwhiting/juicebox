import React, { useState } from "react";
import { submitPost } from "../api/posts";

const NewPost = ({ token, refresh, setRefresh }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!title || !content) {
      console.log('Please enter title and content')
      return
    }
    await submitPost(token, title, content, tags)
    setRefresh(!refresh)
  }

  return (
    <form id="new-post" onSubmit={submitHandler}>
      <input
        value={title}
        type="text"
        placeholder="title"
        onChange={(event) => setTitle(event.target.value)}>
      </input>
      <textarea
        value={content}
        type="text"
        placeholder="content"
        rows="6"
        onChange={(event) => setContent(event.target.value)}>
      </textarea>
      <input
        value={tags}
        type="text"
        placeholder="tags"
        onChange={(event) => setTags(event.target.value)}></input>
      <button type='submit'>Submit</button>
    </form>
  )
}

export default NewPost