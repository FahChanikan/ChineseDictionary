const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register
router.post('/register', async(req, res) => {
    const { email, password, username } = req.body

    try {
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ?', [email]
        )
        if(existing.length > 0) {
            return res.status(400).json({message: 'This email already was used'})
        }

        const hashed = await bcrypt.hash(password, 10)

        await db.query(
            'INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, hashed, username]
        )

        res.json({message: "Register successfully!"})
    } catch (error) {
        res.status(500).json({message: "An error occurred"})
    }


})

//Login
router.post('/login', async(req, res) => {
    const { email, password } = req.body

    try {
        //find user
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?', [email]
        )
        if(rows.length === 0) {
            return res.status(401).json({message: "Do not found this email"})
        }
        //check password
        const user = rows[0]
        const match = await bcrypt.compare(password, user.password)
        if(!match) {
            return res.status(401).json({message: "Password is invalid"})
        }
        //out JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        )

        res.json({
            message: "Login successfully",
            token,
            user: { id: user.id, email: user.email, username: user.username }
        })
    } catch (error) {
        res.status(500).json({message: "An error occured", error: error.message})
    }

})

module.exports = router