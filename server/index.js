require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/flashcards', require('./routes/flashcard'))
app.use('/api/dictionary', require('./routes/dictionary'))
app.use('/api/ai', require('./routes/ai'))

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})