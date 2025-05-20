import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext.jsx'

export const CreatePost = () => {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [inputTag, setInputTag] = useState('')
  const [tags, setTags] = useState([])

  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, contents, tags }),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
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
        value={createPostMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createPostMutation.isPending}
      />
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post created successfully!
        </>
      ) : null}
    </form>
  )
}
