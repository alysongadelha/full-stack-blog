import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getPostById } from '../api/posts'
import { Header } from '../components/Header.jsx'
import { Link } from 'react-router-dom'
import { Post } from '../components/Post'
export const ViewPost = ({ postId }) => {
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })

  const post = postQuery.data

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {post ? <Post {...post} fullPost /> : `Post with id ${postId} not found.`}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
