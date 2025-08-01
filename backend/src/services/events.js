import { v4 as uuidv4 } from 'uuid'
import { Event } from '../db/models/event.js'

export const trackEvent = async ({
  postId,
  action,
  session = uuidv4(),
  date = Date.now(),
}) => {
  const event = new Event({ post: postId, action, session, date })

  return await event.save()
}

export const getTotalViews = async (postId) => ({
  views: await Event.countDocuments({
    post: postId,
    action: 'startView',
  }),
})

export const getDailyViews = async (postId) =>
  await Event.aggregate([
    {
      $match: {
        post: postId,
        action: 'startView',
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: '$date',
            unit: 'day',
          },
        },
        views: { $count: {} },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

export const getDailyDurations = async (postId) =>
  await Event.aggregate([
    {
      $match: {
        post: postId,
      },
    },
    {
      $project: {
        session: '$session',
        startDate: {
          $cond: [
            {
              $eq: ['$action', 'startView'],
            },
            '$date',
            undefined,
          ],
        },
        endDate: {
          $cond: [{ $eq: ['$action', 'endView'] }, '$date', undefined],
        },
      },
    },
    {
      $group: {
        _id: '$session',
        startDate: { $min: '$startDate' },
        endDate: { $max: '$endDate' },
      },
    },
    {
      $project: {
        day: {
          $dateTrunc: {
            date: '$startDate',
            unit: 'day',
          },
        },
        duration: {
          $subtract: ['$endDate', '$startDate'],
        },
      },
    },
    {
      $group: {
        _id: '$day',
        averageDuration: { $avg: '$duration' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
