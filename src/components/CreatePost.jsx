import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { Link } from 'react-router-dom'
import slug from 'slug'

export const CreatePost = () => {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [inputTag, setInputTag] = useState('')
  const [tags, setTags] = useState([])

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents, tags },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
  }

  if (!token) return <div>Please log in to create new posts.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <br />
      <div>
        <div>
          {tags.map((tag) => (
            <span
              key={tag}
              value={tag}
              onClick={() => {
                setTags((prev) => prev.filter((item) => item !== tag))
              }}
              aria-hidden='true'
            >
              {tag}{' '}
            </span>
          ))}
        </div>
        <input
          type='text'
          placeholder='add tags'
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const cleanInput = inputTag.trim()

              setTags((prev) => {
                if (prev.includes(cleanInput)) return prev
                return [...prev, cleanInput]
              })
              setInputTag('')
            }
          }}
        />
        <br />
        Press Enter to add a tag or Click on it to remove
      </div>
      <br />
      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createPost ? (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>
        </>
      ) : null}
    </form>
  )
}
