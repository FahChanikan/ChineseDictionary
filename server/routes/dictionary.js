const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/search', async (req, res) => {
  const { q } = req.query
  if (!q) return res.json([])

  try {
    const [rows] = await db.query(
      `SELECT * FROM dictionary 
       WHERE (word LIKE ? OR pinyin LIKE ? OR meaning LIKE ?)
       AND CHAR_LENGTH(word) <= 6
       ORDER BY CHAR_LENGTH(word) ASC
       LIMIT 10`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'error', error: error.message })
  }
})

module.exports = router