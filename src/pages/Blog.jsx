import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { CreatePost } from '../components/CreatePost'
import { PostFilter } from '../components/PostFilter'
import { PostSorting } from '../components/PostSorting'
import { PostList } from '../components/PostList'
import { Header } from '../components/Header.jsx'
import { GET_POSTS, GET_POSTS_BY_AUTHOR } from '../api/graphql/posts.js'

export const Blog = () => {
  const [author, setAuthor] = useState('')
  const [debouncedFilterInputValue, setDebouncedFilterInputValue] =
    useState(author)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  useEffect(() => {
    const delayInputTimeout = setTimeout(() => {
      setDebouncedFilterInputValue(author)
    }, 500)

    return () => clearTimeout(delayInputTimeout)
  }, [author])

  const { data, loading, error } = useGraphQLQuery(
    debouncedFilterInputValue ? GET_POSTS_BY_AUTHOR : GET_POSTS,
    {
      variables: {
        author: debouncedFilterInputValue,
        options: { sortBy, sortOrder },
      },
    },
  )

  if (loading) return <span>loading...</span>
  if (error) return <h1>error...</h1>

  const posts = data.postsByAuthor ?? data.posts ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Full-Stack React Blog</title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development'
        />
      </Helmet>
      <Header />
      <br />
      <hr />
      <br />
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter
        field='Author'
        value={author}
        onChange={(value) => setAuthor(value)} // TODO Debounce here
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
