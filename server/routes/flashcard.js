const express = require('express')
const router = express.Router()
const db = require('../db')
const auth = require('../middleware/authMiddleware')


router.get('/', auth, async (req, res) => {
    console.log('req.user:', req.user)
    try {
        const [rows] = await db.query(
            'SELECT * FROM flashcards WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]  // ← ตรงนี้
        )
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
})

router.post('/', auth, async (req, res) => {
    console.log('req.user', req.user);

    const { word, pinyin, meaning_th, notes } = req.body
    try {
        const [result] = await db.query(
            'INSERT INTO flashcards (user_id, word, pinyin, meaning_th, notes) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, word, pinyin, meaning_th, notes]
        )
        res.json({ message: 'Add flascard successfully', id: result.insertId })
    } catch (error) {
        res.status(500).json({ message: 'An error occured', error: error.message })
    }
})

router.patch('/:id', auth, async (req, res) => {
    const { word, pinyin, meaning_th, notes } = req.body
    try {
        await db.query(
            'UPDATE flashcards SET word=?, pinyin=?, meaning_th=?, notes=? WHERE id=? AND user_id=?',
            [word, pinyin, meaning_th, notes, req.params.id, req.user.id]
        )
        res.json({ message: "Modify flashcard successfully" })
    } catch (error) {
        res.status(500).json({ message: 'An error occured', error: error.message })
    }
})

router.delete('/:id', auth, async (req, res) => {

    try {
        await db.query(
            'DELETE FROM flashcards WHERE id=? AND user_id=?',
            [req.params.id, req.user.id]
        )
        res.json({ message: "Delete flashcard successfully" })
    } catch (error) {
        res.status(500).json({ message: 'An error occured', error: error.message })
    }
})


module.exports = router