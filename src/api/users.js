export const signup = async ({ username, password }) => {
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
    init,
  )

  if (!res.ok) {
    throw new Error('failed to sign up')
  }

  return await res.json()
}

export const login = async ({ username, password }) => {
  const init = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/login`,
    init,
  )

  if (!res.ok) throw new Error('Failed to login.')

  return await res.json()
}

export const getUserInfo = async (id) => {
  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
    init,
  )

  return await res.json()
}
