import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";

const Posts = ({ token, allPosts, setAllPosts, refresh, setRefresh }) => {


  useEffect(() => {
    const getPosts = async () => {
      const posts = await fetchPosts()
      setAllPosts(posts)
    }
    getPosts();
  }, [token, refresh])

  return (
    <div className="all-posts">

      {
        allPosts.map(((post) => {
          return (
            <div className="post" key={post.id}>
              <div className="post-header">
                <div>{post.author.username}</div>
                <div>{post.title}</div>
              </div>
              <div className="post-body">{post.content}</div>

            </div>
          )
        }))
      }

    </div>
  )
}

export default Posts;