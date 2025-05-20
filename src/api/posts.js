export const getPosts = async (queryParams) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )

  return await response.json()
}

export const createPost = async (token, post) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })

  return await response.json()
}

export const deletePost = async (id) => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    console.info('successfully deleted')
  } catch (error) {
    console.error(error)
  }
}

export const updatePost = async (id, post) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
  )

  return await response.json()
}
