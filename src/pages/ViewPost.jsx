import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPostById } from '../api/posts.js'
import { getUserInfo } from '../api/users.js'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { PostStats } from '../components/PostStats.jsx'
import { postTrackEvent } from '../api/events.js'

const truncate = (str, max = 160) => {
  if (!str) return str
  if (str.length > max) {
    return str.slice(0, max - 3) + '...'
  } else {
    return str
  }
}

export const ViewPost = ({ postId }) => {
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })

  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)

    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

  const post = postQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })

  const userInfo = userInfoQuery.data ?? {}

  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
          <meta name='description' content={truncate(post.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={post.title} />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.username} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {post ? (
        <div>
          <Post {...post} id={postId} author={userInfo} fullPost />
          <hr />
          <PostStats postId={postId} />
        </div>
      ) : (
        `Post with id ${postId} not found.`
      )}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
