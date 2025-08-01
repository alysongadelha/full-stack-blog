/* global use, db */

// Select the database to use.
use('blog-simulated')

db.getCollection('events').aggregate([
  { $match: { action: 'startView' } },
  {
    $project: {
      post: '$post',
      day: { $dateTrunc: { date: '$date', unit: 'day' } },
    },
  },
  { $group: { _id: { post: '$post', day: '$day' }, views: { $count: {} } } },
])
