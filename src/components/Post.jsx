import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import slug from 'slug'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { deletePost } from '../api/posts'
import { User } from './User'

export const Post = ({
  title,
  contents,
  author,
  tags = [],
  id,
  fullPost = false,
}) => {
  const queryClient = useQueryClient()
  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  return (
    <div style={{ position: 'relative' }}>
      {fullPost && (
        <div style={{ position: 'absolute', right: 0 }}>
          <span
            style={{ color: 'red' }}
            onClick={() => deletePostMutation.mutate()}
            aria-hidden='true'
          >
            Delete
          </span>
          <br />
          <span
            style={{ color: 'green' }}
            onClick={() => console.log('Edit post')}
            aria-hidden='true'
          >
            Edit
          </span>
        </div>
      )}
      <article>
        {fullPost ? (
          <h3>{title}</h3>
        ) : (
          <Link to={`/posts/${id}/${slug(title)}`}>
            <h3>{title}</h3>
          </Link>
        )}
        {fullPost && <div>{contents}</div>}
        {author && (
          <em>
            {fullPost && <br />}
            Written by <User {...author} />
          </em>
        )}
        <br />
        <span className='tags'>{tags.map((tag) => tag).join(' | ')}</span>
      </article>
    </div>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  tags: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
