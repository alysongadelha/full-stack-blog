import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { deletePost } from '../api/posts'
import { User } from './User'

export const Post = ({
  title,
  contents,
  author,
  tags,
  _id,
  fullPost = false,
}) => {
  const queryClient = useQueryClient()
  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(_id),
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
          <Link to={`/posts/${_id}`}>
            <h3>{title}</h3>
          </Link>
        )}
        {fullPost && <div>{contents}</div>}
        {author && (
          <em>
            {fullPost && <br />}
            Written by <User id={author} />
          </em>
        )}
        <br />
        {tags.map((tag) => (
          <span style={{ margin: 2, color: 'gray' }} key={tag}>
            {tag}
          </span>
        ))}
      </article>
    </div>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
