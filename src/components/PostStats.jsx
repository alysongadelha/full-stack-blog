import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
} from '../api/events.js'

const formatToHours = (timeInSeconds) =>
  new Date(timeInSeconds * 1000).toISOString().slice(11, 19)

export const PostStats = ({ postId }) => {
  const totalViews = useQuery({
    queryKey: ['totalViews', postId],
    queryFn: () => getTotalViews(postId),
  })
  const dailyViews = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })
  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })

  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return <div>Loading stats....</div>
  }

  const averageDuration = dailyDurations.data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.averageDuration,
    0,
  )

  const averageDurationFormatted = formatToHours(averageDuration)

  const averageDailyViews = Math.floor(
    dailyViews.data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.views,
      0,
    ) / dailyViews.data.length,
  )

  return (
    <div>
      <b>{totalViews.data?.views} total views</b>
      <pre>{averageDailyViews} average daily views</pre>
      <pre>{averageDurationFormatted}</pre>
    </div>
  )
}

PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}
