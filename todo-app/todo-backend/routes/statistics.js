const express = require('express')
const router = express.Router()
const redis = require('../redis')

router.get('/', async (_, res) => {
  const currentCount = await redis.getAsync('added_todos') || 0
  res.json({ added_todos: Number(currentCount) })
})

module.exports = router
